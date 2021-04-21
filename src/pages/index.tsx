import { useEffect } from "react"

export default function Home(props) {
  /* Consumindo API (SPA): chama a API cada vez que a página é exibida
  useEffect(() => {
    fetch('http://localhost:3333/episodes')
      .then(response => response.json())
      .then(data => console.log(data))
  }, [])
  */
  return (
    <div>
      <h1>Index</h1>

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
export async function getStaticProps() {
  const response = await fetch('http://localhost:3333/episodes')
  const data = await response.json()

  return {
    props: {
      episodes: data
    },
    //revalidate: número (em segundos) de quanto tempo para atualizar essa página
    //No nosso caso abaixo, a cada 8 horas
    revalidate: 60 * 60 * 8
  }
}

