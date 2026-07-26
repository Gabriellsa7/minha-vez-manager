import { Link } from 'react-router';
import { BoltIcon } from '../../assets/svg';
import styles from './not-found.module.scss';

function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.brand}>
        <span className={styles.icon}>
          <BoltIcon />
        </span>
        <span className={styles.brandName}>Central de Gerenciamento</span>
      </div>

      <div className={styles.content}>
        <span className={styles.statusCode}>404</span>
        <h1 className={styles.title}>Página não encontrada</h1>
        <p className={styles.description}>
          A página que você tentou acessar não existe ou foi movida.
        </p>
        <Link to="/login" className={styles.homeLink}>
          Ir para o início
        </Link>
      </div>
    </div>
  );
}

export { NotFound };
