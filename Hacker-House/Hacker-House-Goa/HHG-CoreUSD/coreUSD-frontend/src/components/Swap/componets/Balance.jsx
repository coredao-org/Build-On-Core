import styles from "../styles";

const Balance = ({ tokenBalance }) => {
  return (
    <div className={styles.balance}>
      <p className={styles.balanceText}>
        <span className={styles.balanceBold}>Balance: </span>
        {tokenBalance ?? "0"}
      </p>
    </div>
  );
};

export default Balance;
