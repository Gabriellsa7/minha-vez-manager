import style from './open-queue-card.module.scss';

interface OpenQueueCardProps {
  queueDate: string;
  onOpen: () => void;
}

function OpenQueueCard({ queueDate, onOpen }: OpenQueueCardProps) {
  return (
    <div className={style.container}>
      <div className={style.content}>
        <span className={style.title}>No queue is currently open</span>

        <span className={style.description}>
          Queue scheduled for <strong>{queueDate}</strong> is ready to be
          started.
        </span>
      </div>

      <button className={style.button} onClick={onOpen}>
        Open Queue
      </button>
    </div>
  );
}

export { OpenQueueCard };
