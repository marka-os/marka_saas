import { Helmet } from "react-helmet-async";

export default function About() {
  return (
    <div>
      <Helmet>
        <title>About</title>
        <meta name="description" content="Learn about Marka" />
      </Helmet>
      <div>
        <h1>about</h1>
      </div>
    </div>
  );
}
