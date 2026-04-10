import { useSearchParams } from "react-router-dom";

const TestFrame = () => {
  const [searchParams] = useSearchParams();
  const url = searchParams.get("url");

  return (
    <>
      {url && (
        <iframe
          src={url}
          className="fixed top-16 left-0 w-full h-full"
          loading="eager"
        >
          Загрузка…
        </iframe>
      )}
    </>
  );
};

export default TestFrame;
