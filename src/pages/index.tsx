import { useContext } from 'react';
//Importa a tipagem da função 'getStaticProps'
import { GetStaticProps } from 'next'

//O componente 'Image' do Next otimiza as imagens na web de maneira automatizada
import Image from 'next/image'
import Link from 'next/link';

import { format, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"
import { api } from "../services/api"
import { convertDurationToTimeString } from "../utils/convertDurationToTimeString";

import { PlayerContext } from '../contexts/PlayerContext';

import styles from './home.module.scss'

type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  duration: number;
  durationAsString: string;
  url: string;
  publishedAt: string;
}

//interface ou type, tanto faz!!!
type HomeProps = {
  latestEpisodes: Episode[] // Ou 'Array<Episode>'
  allEpisodes: Episode[] // Ou 'Array<Episode>'
}

export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {
  /* Consumindo API (SPA): chama a API cada vez que a página é exibida
  useEffect(() => {
    fetch('http://localhost:3333/episodes')
      .then(response => response.json())
      .then(data => console.log(data))
  }, [])
  */
  const { play } = useContext(PlayerContext)

  return (
    <div className={styles.homepage}>
      <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos</h2>
        <ul>
          {latestEpisodes.map(episode => {
            return (
              <li key={episode.id}>
                {/*
                width e height corresponde a como a imagem será carregada e não exibida
                Normalmente é bom baixar com 3x o tamanho da exibição por conta
                das telas com retina display
              */}
                <Image width={192} height={192} objectFit="cover" src={episode.thumbnail} alt={episode.title} />
                <div className={styles.episodeDetails}>
                  <Link href={`/episodes/${episode.id}`}>
                    <a>{episode.title}</a>
                  </Link>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationAsString}</span>
                </div>

                <button type="button" onClick={() => play(episode)}>
                  <img src="/play-green.svg" alt="Tocar episódio" />
                </button>
              </li>
            );
          })}
        </ul>
      </section>
      <section className={styles.allEpisodes}>
        <h2>Todos episódios</h2>
        <table cellSpacing={0}>
          <thead>
            <tr>
              <th></th>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allEpisodes.map(episode => {
              return (
                <tr key={episode.id}>
                  <td style={{ width: 72 }}>
                    <Image
                      width={120}
                      height={120}
                      src={episode.thumbnail}
                      objectFit="cover"
                    />
                  </td>
                  <td>
                    <Link href={`/episodes/${episode.id}`}>
                      <a>{episode.title}</a>
                    </Link>
                  </td>
                  <td>{episode.members}</td>
                  <td style={{ width: 100 }}>{episode.publishedAt}</td>
                  <td>{episode.durationAsString}</td>
                  <td>
                    <button type="button" onClick={() => play(episode)}>
                      <img src="/play-green.svg" alt="Tocar episódio" />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>
    </div>
  )
}
//Com Server-side renering (SSR):
//É necessário exporta uma função chamada 'getServerSideProps' e que deve retornar
//um objeto com a propriedade 'props'. Esse objeto será passado para o componente
//(no nosso exemplo 'Home' (acima).
//Apesar de ser executado do lado do servidor, a API é chamada toda vez que um
//usuário atualiza a página, por exemplo
// export async function getServerSideProps() {
//   const response = await fetch('http://localhost:3333/episodes')
//   const data = await response.json()

//   return {
//     props: {
//       episodes: data
//     }
//   }
// }

//Com server-side generation
//Atenção: só funciona em produção (após build)
export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  })


  //BOA PRÁTICA!!! As formatações nos dados precisam ocorrer aqui (antes deles serem enviados aos componentes)
  //Dessa forma, as funções de formatação não são chamadas sempre que o componente
  //é renderizado.
  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR }),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      url: episode.file.url
    }
  })

  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);

  return {
    props: {
      latestEpisodes,
      allEpisodes
    },
    //revalidate: número (em segundos) de quanto tempo para atualizar essa página
    //No nosso caso abaixo, a cada 8 horas
    revalidate: 60 * 60 * 8
  }
}

