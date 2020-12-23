import Head from "next/head";
import { Container } from "semantic-ui-react";

import Header from "./Header";

function Layout({ children,user }) {
  return (
    <>
      <Head>
        {/* Stylesheets */}
        <link rel="stylesheet" type="text/css" href="/static/styles.css" />
        <link rel="stylesheet" type="text/css" href="/static/nprogress.css" />
        <link
          rel="stylesheet"
          href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.2/semantic.min.css"
        />
        <title>Serverless</title>
        <meta property="og:title" content="My page title" key="title" />
      </Head>
      <Header user={user} />
      <Container text style={{ paddingTop: "1em" }}>
        {children}
      </Container>
    </>
  );
}

export default Layout;
