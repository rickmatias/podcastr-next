import Document, {Html, Head, Main, NextScript} from 'next/document';

//A declaração dessa função prexisa ser como classe por exigência do Next
export default class MyDocument extends Document {
  render(){
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link href="https://fonts.googleapis.com/css2?family=Inter&family=Lexend:wght@500;600&display=swap" rel="stylesheet" />
        </Head>
        <body>
            <Main /> {/*É aonde vai ficar a nossa aplicação*/}
            <NextScript /> {/*São os scripts que o Next precisa injetar para que a aplicação funcione*/}
          </body>
      </Html>
    );
  }
}