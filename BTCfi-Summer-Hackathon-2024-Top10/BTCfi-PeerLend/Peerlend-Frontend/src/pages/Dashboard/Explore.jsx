import React, { useState, useEffect } from 'react'
import { formatUnits } from "ethers";
import { RiFolderWarningFill } from "react-icons/ri";
import UseFetchRequests from '../../Hooks/UseFetchRequests';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Link } from 'react-router-dom';

import tokenList from '../../constants/tokenList';
import requestImage from '../../assets/request.jpeg';


const Explore = () => {
  const allRequests = UseFetchRequests();
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (allRequests.length >= 0) {
      setIsLoading(false);
    }
  }, [allRequests]);

  return (
    <main>
      <div className='flex justify-between items-center mb-6'>
        <h2 className="lg:text-[24px] md:text-[24px] text-[20px] text-[#E0BB83] font-playfair font-bold mb-4 items-center">Explore</h2>
      </div>
      <section className='flex flex-col lg:flex-row md:flex-row justify-between mb-6'>
        <div className='bg-gradient-to-r from-[#E0BB83]/40 via-[#2a2a2a] to-[#E0BB83]/30 lg:p-6 md:p-6 p-4 rounded-md lg:w-[67%] md:w-[67%] w-[100%] mb-4 shadow-lg'>
          <h3 className='text-[20px] font-playfair font-[700] my-4'>Explore All Active Requests</h3>
          <div className='w-[100%'>
            <p className='w-[100%] font-[400]'>Browse through diverse requests, evaluate the details, and as a lender choose the ones you want to fund. It&apos;s an easy way to find and support borrowers on PeerLend..</p>

          </div>
        </div>
        <div className="bg-[#e0bb8314] shadow-lg border border-[#E0BB83]/30 p-6 rounded-lg w-[100%] lg:w-[15%] md:w-[15%] text-center flex mb-4 flex-col items-center justify-center">
          <h3>Borrowers</h3>
          <p className="lg:text-[28px] md:text-[28px] text-[20px] font-bold">11</p>
        </div>
        <div className="bg-[#e0bb8314] shadow-lg border border-[#E0BB83]/30 p-6 rounded-lg w-[100%] lg:w-[15%] md:w-[15%] text-center flex mb-4 flex-col items-center justify-center">
          <h3>Lenders</h3>
          <p className="lg:text-[28px] md:text-[28px] text-[20px] font-bold">4</p>
        </div>
      </section>
      <section>
        <h3 className='text-[20px] font-playfair font-[700] my-4 text-[#E0BB83]'>All Active Requests</h3>
        <div className="flex justify-between flex-wrap">
          {isLoading ? <LoadingSpinner /> :
            allRequests?.length === 0 ? (
              <div className='flex flex-col items-center w-full my-8'>
                <RiFolderWarningFill className='text-[54px] mb-4 text-[#E0BB83]' />
                <h2 className='text-[18px] lg:text-[24px] md:text-[24px] mb-4'>No request yet!</h2>
              </div>
            ) : (allRequests.map((data, index) => (
              <div key={index} className="w-[100%] lg:w-[31%] md:w-[31%] rounded-lg border border-bg-ash/35 bg-bg-gray p-4 mt-6">
                <Link to={`/dashboard/explore/${data?.id}`}>
                  <img src={requestImage} alt="" className="w-[100%] rounded-lg h-[200px] object-cover object-center mb-4" />
                  <p>Amount: {formatUnits(data?.amount, tokenList[data?.loanReq]?.decimals)}</p>
                  <p>Rate: {data?.interest.toString()}<span>&#37;</span></p>
                  <p>Repayment: {formatUnits(data?.repayment, tokenList[data?.loanReq]?.decimals + 1)}</p>
                  <p>Return date: <span>{(new Date(Number(data?.rDate) * 1000)).toLocaleString()}</span></p>
                </Link>
              </div>)
            ))}
        </div>
      </section>
    </main>
  )
}

export default Explore