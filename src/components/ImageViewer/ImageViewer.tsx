import useFetchCats from '../../hooks/useFetchCats';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ROUTES, WINDOW_MESSAGES } from '../../constants';

const ImageViewer = () => {
  const buttonWindow = useRef<Window | null>(null);
  const onStart = useCallback(() => {
    buttonWindow.current?.postMessage(WINDOW_MESSAGES.loading);
    buttonWindow.current?.postMessage(WINDOW_MESSAGES.noError);
  }, []);
  const onError = useCallback(() => {
    buttonWindow.current?.postMessage(WINDOW_MESSAGES.error);
  }, []);
  const onFinally = useCallback(() => {
    buttonWindow.current?.postMessage(WINDOW_MESSAGES.loadingFinished);
  }, []);

  const { data, error, isLoading, retry } = useFetchCats({ onError, onFinally, onStart });
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    buttonWindow.current =
      window.open(
        ROUTES.button,
        '_blank',
        'height=200,top=810,left=560,nodeIntegration=no',
      );

    return () => {
      buttonWindow.current?.close();
    }
  }, []);

  useEffect(() => {
    const beforeUnloadListener = () => {
      buttonWindow.current?.close();
    }

    window.addEventListener('beforeunload', beforeUnloadListener);

    return () => {
      window.removeEventListener('beforeunload', beforeUnloadListener);
    }
  }, []);

  useEffect(() => {
    if (!data?.length) return;
    const messageListener = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data === WINDOW_MESSAGES.nextImage) {

        setImageIndex((prevState) => {
          let newValue = prevState + 1;

          if (newValue > data.length - 1) {
            newValue = 0;
            retry();
          }

          return newValue;
        });
      }
    }
    window.addEventListener('message', messageListener);

    return () => {
      window.removeEventListener('message', messageListener);
    }
  }, [data, retry]);

  if (error) {
    return (
      <>
        <p className="loading-error">Ошибка загрузки данных</p>
        <button onClick={retry}>Попробовать снова</button>
      </>);
  }

  if (isLoading) {
    return <p>Загрузка...</p>;
  }

  const imageUrl = data![imageIndex].url;

  return (
    <img src={imageUrl} width="512" height="512"  alt='Cat'/>
  );
}

export default ImageViewer;
