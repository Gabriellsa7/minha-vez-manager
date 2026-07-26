import { BoltIcon } from '../../assets/svg/index';
import styles from './error.module.scss';

function Error() {
  function handleReloadPage() {
    window.location.reload();
  }

  return (
    <div className={styles.container}>
      <div className={styles.brand}>
        <span className={styles.icon}>
          <BoltIcon />
        </span>
        <span className={styles.brandName}>Central de Gerenciamento</span>
      </div>

      <div className={styles.content}>
        <span className={styles.statusCode}>500</span>
        <h1 className={styles.title}>Algo deu errado</h1>
        <p className={styles.description}>
          Ocorreu um erro inesperado ao carregar esta página. Recarregue a
          página para tentar novamente.
        </p>

        <button
          type="button"
          className={styles.primaryAction}
          onClick={handleReloadPage}
        >
          Recarregar página
        </button>
      </div>
    </div>
  );
}

export { Error };
