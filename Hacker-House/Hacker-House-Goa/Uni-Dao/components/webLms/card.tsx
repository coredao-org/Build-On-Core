import { ThumbsUp } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { BiShare } from 'react-icons/bi'
import { FaArrowTrendUp } from 'react-icons/fa6'
import { IoMdShare } from 'react-icons/io'

function Card({ data }: any) {
    return (
        <div className='bg-[#222222] hover:scale-105 rounded-2xl w-[20%] p-4 flex flex-col gap-4 cursor-pointer'>
            <div className='relative w-full h-48 rounded-2xl overflow-hidden'>
                <Image src={data.img} alt='something something' layout='fill' className='w-full' />
            </div>
            <div className='flex w-full justify-between'>
                <div className='flex items-center gap-2 bg-gradient-to-r from-[#FD9907] to-[#FFCE08] rounded-full py-1 px-3 text-black font-rfdewi font-semibold'>
                    <FaArrowTrendUp /> <p>{data.raised}</p>
                </div>
                <div className='text-[#acaeb0]'>
                    <p>{data.completion}</p>
                </div>
            </div>

            <h1 className='text-3xl font-rfdewi font-semibold text-[#E8EAED]'>{data.name}</h1>
            <p className='text-[#acaeb0]'>
                {data.description}
            </p>

            <div className='flex gap-4'>
                <div className='flex gap-2 bg-[#494a4a] p-2 px-4 rounded-full text-sm items-center'>
                    <ThumbsUp className='' />
                    <p>{data.likes}</p>
                </div>
                <div className='flex gap-2 bg-[#494a4a] p-2 px-4 rounded-full text-sm items-center'>
                    <IoMdShare className='' />
                    <p>{data.likes}</p>
                </div>
            </div>
        </div>
    )
}

export default Card