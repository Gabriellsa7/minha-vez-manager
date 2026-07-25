import style from './health-unit-modal.module.scss';
interface CreateHealthUnitModalProps {
  open: boolean;
  onClose: () => void;
}

function HealthUnitModal({ onClose, open }: CreateHealthUnitModalProps) {
  if (!open) return null;

  return (
    <div className={style.overlay}>
      <div className={style.modal}>
        <h2>Create Health Unit</h2>

        {/* Conteúdo */}

        <button onClick={onClose}>Fechar</button>
      </div>
    </div>
  );
}

export { HealthUnitModal };
