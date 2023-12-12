const verificationEmail = ({
  email,
  token,
}: {
  email: string;
  token: string;
}) => {
  return (
    <div>
      <a
        href={`http://localhost:3000/verify-email?email=${email}&token=${token}`}
      >
        Verifique seu email
      </a>
    </div>
  );
};

export default verificationEmail;
