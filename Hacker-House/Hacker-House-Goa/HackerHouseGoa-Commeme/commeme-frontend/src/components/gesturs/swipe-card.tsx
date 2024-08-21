import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import React, { useState } from "react";
import { Card, CardFooter } from "@/components/ui/card";
import { Button } from "../ui/button";
import { Commeme } from "@/lib/types";
import { shortenAddress } from "@/lib/utils";
import { formatEther, parseEther } from "viem/utils";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { SupportChainId } from "@/hooks/use-query-commemes";
import { CONSTANT_ADDRESSES } from "@/data/addresses-data";
import { toast } from "sonner";
import { TransactionToast } from "../ui/transaction-toast";
import { useAccount, useChainId, useWalletClient,   } from "wagmi";
import { Modal, ModalTrigger, ModalBody } from "../ui/animated-modal";

interface CardRotateProps {
  index: number;
  currentIndex: number;
  children: React.ReactNode;
  onSwipeRight: () => void;
  onSwipeLeft: () => void;
}

function SwipeCard({
  children,
  onSwipeRight,
  onSwipeLeft,
  index,
  currentIndex,
}: CardRotateProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useTransform(x, [-100, 100], [0.9, 1.1]);
  const rotateZ = useTransform(x, [-100, 100], [-20, 20]);

  function handleDragEnd(_: any, info: PanInfo) {
    const threshold = 180;
    if (info.offset.x > threshold) {
      onSwipeRight();
    } else if (info.offset.x < -threshold) {
      onSwipeLeft();
    } else {
      x.set(0);
      y.set(0);
    }
  }

  return (
    <motion.div
      className="absolute cursor-grab left-1/2 top-1/2 w-[50%] h-[60%] "
      initial={{
        translateX: "-50%",
        translateY: "-50%",
      }}
      style={{
        x,
        y,
        scale,
        rotateZ,
        zIndex: -Math.abs(currentIndex - index) * 10,
      }}
      drag
      dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
      dragElastic={0.6}
      whileTap={{ cursor: "grabbing" }}
      onDragEnd={handleDragEnd}
    >
      {children}
    </motion.div>
  );
}

export default function SwipeableStackCards({ commemes, chainId ,refetch}: { commemes: Commeme[], chainId: SupportChainId,refetch: Function}) {
  const [currentCard, setCurrentCard] = useState(0);
  const [donationAmount, setDonationAmount] = useState<string>("");
  const chainData = CONSTANT_ADDRESSES[chainId];
  const account = useAccount()
  const wallet = useWalletClient()
  

  const currentChainId = useChainId()
  
  const swipeLeft = (index: number) => {
    if (index !== currentCard) {
      setCurrentCard(index);
    }
    if (currentCard === commemes.length - 1) return;
    setCurrentCard((prev) => prev + 1);
  };

  const swipeRight = (index: number) => {
    if (index !== currentCard) {
      setCurrentCard(index);
    }
    if (currentCard === 0) return;
    setCurrentCard((prev) => prev - 1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDonationAmount(e.target.value);
  };
  return (
    <div className="relative h-[700px] w-[800px]" style={{ perspective: 600 }}>
      {commemes.map((card, index) => {
        const totalDonation = Number(formatEther(BigInt(card.totalDonation.toString())));
        const threshold = Number(formatEther(BigInt(card.threshold.toString())));
        const progress = (totalDonation / threshold) * 100;
        const remainingDonation = threshold - totalDonation;

        const handleDonate = async () => {
          if (!donationAmount) {
            toast.error("Please enter a donation amount");
            return;
          }
          if (Number(donationAmount) <= 0) {
            toast.error("Please enter a valid donation amount");
            return;
          }
          try {
            if (!chainData) {
              throw new Error("Invalid chain id")
            }

            if (!account) {
              throw new Error("Please connect your wallet")
            }
            if (currentChainId !== account.chainId) {
              await wallet.data?.switchChain({
                id: chainId
              })
            }
            const hash = await wallet.data?.sendTransaction({
              to: card.commemeAddress as `0x${string}`,
              value: parseEther(donationAmount),
              chainId: chainId
            })
            if (!hash) {
              throw new Error("Transaction failed")
            }
            console.log(hash);
            toast.success(<TransactionToast hash={hash} title="Funds Sent" scanner={`${chainData.scanner}/tx/`} />,{
              duration: 100000,
              cancel: "Close"
            });

          } catch (error) {
            toast.error(`Failed to send transaction: ${(error as any).message}`);
          } finally {
            setDonationAmount("");
            await refetch();

          }

        };

        return (
          <SwipeCard
            key={card.id}
            onSwipeRight={() => swipeRight(index)}
            onSwipeLeft={() => swipeLeft(index)}
            index={index}
            currentIndex={currentCard}
          >
            <motion.div
              animate={{
                rotateZ: (index - currentCard) * 2,
                rotateX: -Math.abs(index - currentCard) * 3,
                scale: 1 - Math.abs(index - currentCard) * 0.07,
                x: -(currentCard - index) * 20,
                y: -Math.abs(index - currentCard) * 4,
              }}
              initial={false}
              transition={{ type: "spring", stiffness: 160, damping: 8 }}
            >
              <Card className="h-full w-full">
                <div>
                  {card.image && (
                    <img
                      src={card.image}
                      alt={card.name}
                      className="w-full object-fill"
                      width={120}
                    />
                  )}
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-center">
                    <div className="">
                      <h3 className="font-semibold">{card.name}</h3>

                      <a href={`${chainData.scanner}/address/${card.creator}`} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                        {shortenAddress(card.creator)}
                      </a>
                    </div>
                    <Modal>
                      <ModalTrigger>
                        <Button className="w-20">
                          Share
                        </Button>
                      </ModalTrigger>
                      <ModalBody className="p-2 w-full flex justify-center items-center">
                      <button className="shadow-[inset_0_0_0_2px_#616467] text-black p-3 rounded-full tracking-widest uppercase font-semibold bg-transparent hover:bg-[#616467] hover:text-white dark:text-neutral-200 transition duration-200 w-full">
                         ❤️ Share on Twitter
                        </button>
                        {/* <Button onClick={() => handleShare("instagram", card)}>
                          Share on Instagram
                        </Button> */}
                      </ModalBody>
                    </Modal>
                  </div>
                  <p>{card.description}</p>
                  <div className="mt-2">
                    {remainingDonation !== 0 ? (
                      <Badge>Active</Badge>
                    ) : (
                    <Badge variant="destructive">Dead</Badge>
                    )}
                  </div>
                  <div className="mt-2">
                    <Progress value={progress} />
                    <p className="text-xs mt-1">{progress.toFixed(2)}% complete</p>
                    <p className="text-xs mt-1">Needs {remainingDonation.toFixed(4)} {chainData.tokenName} to deploy as meme token</p>
                  </div>
                  {card.poolAddress !== "0x0000000000000000000000000000000000000000" && (
                    <div className="mt-2">
                      <a href={`https://www.sushi.com/swap?chainId=${chainData.chain.id}&token0=NATIVE&token1=${card.tokenAddress}`} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                        Pool
                      </a>
                    </div>
                  )}
                  {card.tokenAddress !== "0x0000000000000000000000000000000000000000" && (
                    <div className="mt-2">
                      <a href={`${chainData.scanner}/address/${card.tokenAddress}`} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                        Token
                      </a>
                    </div>
                  )}
                </div>
                <CardFooter className="flex flex-col items-center">
                  <input
                    type="number"
                    value={donationAmount}
                    onChange={handleInputChange}
                    placeholder="Amount in Native Currency "
                    className="p-2 border rounded mb-2 w-full text-black"
                  />
                  <Button className="w-full" onClick={handleDonate}>
                    Fund
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </SwipeCard>
        );
      })}
    </div>
  );
}
