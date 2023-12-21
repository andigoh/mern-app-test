export interface GetServerSideProps {
  req: {
    cookies: {
      token: string;
    };
    params: {
      id?: string;
      token?: string;
    };
  };
}
