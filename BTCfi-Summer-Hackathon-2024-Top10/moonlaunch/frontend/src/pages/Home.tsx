import Herosection from "../components/Herosection";
import Tokendisplay from "../components/Tokendisplay";
import Footer from "../components/Footer";
import { useAccount } from "wagmi";
import { useTokens } from "../hooks/useToken";
import { motion } from "framer-motion";

const Pageanime = {
  initial: {
    x: 800,
    opacity: 0,
  },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.75,
      ease: "easeInOut",
    },
  },
  exit: {
    x: 300,
    opacity: 0,
    transition: {
      duration: 0.75,
      ease: "easeInOut",
    },
  },
};
const Home = () => {
  const { chainId } = useAccount();
  const { data } = useTokens(chainId ? chainId : 1115, "timestamp", 10);

  return (
    <motion.div
      variants={Pageanime}
      initial="initial"
      animate="animate"
      exit="exit"
      className="bg-[#191A1A] pt-[80px] pb-5"
    >
      <Herosection />
      <Tokendisplay tokens={data || []} />
      <Footer />
    </motion.div>
  );
};

export default Home;
