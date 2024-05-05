import { WINDOW_MESSAGES } from '../../constants';
import { useEffect, useState } from 'react';

const Button = () => {
  const [isFetching, setIsFetching] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const messageListener = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return

      if (event.data === WINDOW_MESSAGES.loading) {
        setIsFetching(true);
      } else if (event.data === WINDOW_MESSAGES.loadingFinished) {
        setIsFetching(false);
      } else if (event.data === WINDOW_MESSAGES.error) {
        setIsError(true);
      } else if (event.data === WINDOW_MESSAGES.noError) {
        setIsError(false);
      }
    }

    window.addEventListener('message', messageListener)

    return () => {
      window.removeEventListener('message', messageListener)
    }
  }, []);
  const handleClick = () => {
    window.opener.postMessage(WINDOW_MESSAGES.nextImage);
  }

  return (
    <button
      disabled={isFetching || isError}
      onClick={handleClick}
    >
      Следующая картинка
    </button>
  );
}

export default Button;