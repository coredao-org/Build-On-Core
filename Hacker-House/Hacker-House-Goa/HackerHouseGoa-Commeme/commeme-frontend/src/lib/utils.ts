import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

import { createClient } from '@supabase/supabase-js'
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function createJsonFile(data:any) {
  const jsonString = JSON.stringify(data);
  const blob = new Blob([jsonString], { type: 'application/json' });
  return new File([blob], 'data.json', { type: 'application/json' });
}


export function shortenAddress(address: string, length: number = 4): string {
  if (address.length <= length * 2 + 2) {
    return address; // No need to shorten if the address is already short
  }

  const start = address.substring(0, length + 2); // Include '0x'
  const end = address.substring(address.length - length);

  return `${start}...${end}`;
}

export const storeFiles = async (files: File[]) => {
  const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY,
  );
  console.log(files[0].name, 'file name');
  console.log({supabase})
  const { data, error } = await supabase.storage
    .from('memes')
    .upload(
      `${generateRandomThreeDigitNumber()}${cleanImageName(files[0].name)}`,
      files[0],
      {
        upsert:true
      }
    )
    .catch((error) => {
      console.error('Error uploading file:', error);
      throw error;
    });
  console.log({error})
  console.log(data, 'data');

  if (!files[0] || error) {
    return '';
  }
  console.log(data.path, 'image path');
  return `https://potvocgpbmchiovuemzj.supabase.co/storage/v1/object/public/memes/${data.path}`;
};


function generateRandomThreeDigitNumber() {
  // Option 1: Using Math.floor and modulo
  const randomNum = Math.floor(Math.random() * 900) + 100; // Generates a number between 100 and 999

  // Option 2: Using string manipulation
  // let randomNum = (Math.random() * 1000).toString().padStart(3, "0");
  // randomNum = parseInt(randomNum);

  return randomNum;
}
const cleanImageName = (name: string) => {
  return name.replace(/[^a-zA-Z0-9]/g, '');
};