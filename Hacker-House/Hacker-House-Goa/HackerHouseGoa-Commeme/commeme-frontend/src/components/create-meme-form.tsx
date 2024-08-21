import  { ChangeEvent, useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";
import { encodeFunctionData } from "viem/utils";
import { COMMEME_FACTORY_ABI } from "@/data/commeme-factory-abi";
import { createJsonFile, storeFiles } from "@/lib/utils";
import { useAccount, useChains } from "wagmi";
import { CONSTANT_ADDRESSES } from "@/data/addresses-data";
import { TransactionToast } from "./ui/transaction-toast";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

export default function CreateMemeForm() {
  const { address } = useAccount();
  const [loading, setLoading] = useState(false);
  const [memeName, setMemeName] = useState("");
  const [memeDescription, setMemeDescription] = useState("");
  const [memeSymbol, setMemeSymbol] = useState("");
  const [totalSupply, setTotalSupply] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedImage(file);
  };

  useEffect(() => {
    if (!selectedImage) {
      setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedImage);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedImage]);

  const [_, setLocation] = useLocation();

  const chains = useChains()
  const [selectedChain, setSelectedChain] = useState(chains[0].id)
  const chainsIds = chains.map((chain) => chain.id)
  const onDeploy = async () => {
    setLoading(true);
    const loadingToast = toast.loading("Deploying meme");
    try {
      if (!selectedImage) {
        throw new Error("Please select an image");
      }
      if (!memeName) {
        throw new Error("Please enter a meme name");
      }
      if (!address) {
        throw new Error("Please connect your wallet");
      }

      if (!CONSTANT_ADDRESSES[selectedChain as keyof typeof CONSTANT_ADDRESSES]) {
        throw new Error("Invalid chain id");
      }
      const addresses =
        CONSTANT_ADDRESSES[selectedChain as keyof typeof CONSTANT_ADDRESSES];
      const imageUrl = await storeFiles([selectedImage]);
      console.log(imageUrl, "image url");
      const metadataJson = createJsonFile({
        descrption: memeDescription,
        image: imageUrl,
        title: memeName,
      });

      console.log(metadataJson, "metadata");
      const metadataUrl = await storeFiles([metadataJson]);
      console.log({ metadataUrl });

      const rawData = encodeFunctionData({
        abi: COMMEME_FACTORY_ABI,
        functionName: "createCommeme",
        args: [
          address,
          memeName,
          memeSymbol,
          metadataUrl,
          BigInt(parseFloat(totalSupply) * 10 ** 18),
          BigInt(1000000000000000),
          addresses.factoryAddress,
          addresses.routerAddress,
          addresses.wrapAddress,
          addresses.legacyAddress,
          BigInt(1),
        ],
      });

      console.log(rawData, "raw data");
      console.log(`${import.meta.env.VITE_RELAY}/transaction`);
      const res = await fetch(`${import.meta.env.VITE_RELAY}/transaction`, {
        body: JSON.stringify({
          to: addresses.commemeFactory,
          data: rawData,
          value: 0,
          chainId: selectedChain,
        }),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log({ res });
      const responseJson = (await res.json()) as unknown as { hash: string };
      toast.success(
        <TransactionToast
          hash={responseJson.hash}
          title="Commeme Deployed"
          scanner={`${addresses.scanner}/tx/`}
        />
      );
      setLocation(`/explore/${selectedChain}`);
    } catch (e) {
      console.error(e);
      toast.error("Error deploying meme");
      toast.error((e as any).message);
    } finally {
      toast.dismiss(loadingToast);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center overflow-x-scroll">
      <div className="text-xl  font-semibold">Create a meme</div>
      <div className="my-4 grid w-full max-w-sm items-center gap-1.5">
        {/* {inputFields.map((field, index) => (
         
        ))} */}
        <div>
          <Label htmlFor="chain">Select Which Blockchain (It's gasless to post a meme)</Label>
          <RadioGroup defaultValue={selectedChain.toString()} onValueChange={e=>setSelectedChain(parseFloat(e))}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value={`${chainsIds[0]}`} id="option-one" />
              <Label htmlFor="option-one">CoreDao</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value={`${chainsIds[1]}`} id="option-two" />
              <Label htmlFor="option-two">Polygon Mainnet</Label>
            </div>
          </RadioGroup>
          <Label htmlFor={"name"}>Meme Name</Label>
          <Input
            type="text"
            placeholder={"Meme Name"}
            className="bg-slate-50"
            value={memeName}
            onChange={(e) => setMemeName(e.target.value)}
          />
          <Label htmlFor={"symbol"}>Meme Symbol</Label>
          <Input
            type="text"
            placeholder={"Symbol"}
            className="bg-slate-50"
            value={memeSymbol}
            onChange={(e) => setMemeSymbol(e.target.value)}
          />
          <Label htmlFor={"supply"}>Total Supply</Label>
          <Input
            type="number"
            placeholder={"Supply"}
            className="bg-slate-50"
            value={totalSupply}
            onChange={(e) => setTotalSupply(e.target.value)}
          />

          <Label htmlFor={"description"}>Description</Label>
          <Input
            type="text"
            placeholder={"Description"}
            className="bg-slate-50"
            value={memeDescription}
            onChange={(e) => setMemeDescription(e.target.value)}
          />

          <Label htmlFor="image">Upload an image</Label>
          <div className="grid gap-2">
            <Input
              id="image"
              type="file"
              className="bg-slate-50"
              accept="image/*"
              onChange={handleImageChange}
            />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                width={300}
                height={300}
                className="aspect-square mx-auto rounded-md object-fill"
              />
            )}
          </div>
        </div>
        <div className="text-xl"> OR</div>
        <Link href="/meme-template" className="text-blue-500 underline">
          Use our meme template
        </Link>
        <Button className="mt-2" onClick={onDeploy}>
          {loading ? "Loading" : "Create a meme"}
        </Button>
      </div>
    </div>
  );
}
