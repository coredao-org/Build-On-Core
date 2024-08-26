import React, { useState, useEffect } from 'react'
import CreateRequest from '../../components/CreateRequest'
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import UseFetchRequests from '../../Hooks/UseFetchRequests';
import LoadingSpinner from '../../components/LoadingSpinner'
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { formatUnits } from "ethers";
import { RiFolderWarningFill } from "react-icons/ri";
import { Link } from 'react-router-dom';
import tokenList from '../../constants/tokenList';

import requestImage from '../../assets/request.jpeg';

const Portfolio = () => {
  const allRequests = UseFetchRequests();
  const [isLoading, setIsLoading] = useState(true)
  const { address } = useWeb3ModalAccount();

  useEffect(() => {
    if (allRequests.length >= 0) {
      setIsLoading(false);
    }
  }, [allRequests]);

  const userRequests = allRequests.filter(request => request?.address === address);

  console.log(userRequests);

  return (
    <main>
      <div className='flex justify-between items-center mb-6'>
        <h2 className="lg:text-[24px] md:text-[24px] text-[20px] text-[#E0BB83] font-playfair font-bold mb-4 items-center">Portfolio</h2>
      </div>
      <section className='flex flex-col lg:flex-row md:flex-row justify-between mb-6'>
        <div className='bg-gradient-to-r from-[#E0BB83]/40 via-[#2a2a2a] to-[#E0BB83]/30 lg:p-6 md:p-6 p-4 rounded-md lg:w-[67%] md:w-[67%] w-[100%] mb-4 shadow-lg'>
          <h3 className='text-[20px] font-playfair font-[700] my-4'>Get a Loan</h3>
          <div className='flex lg:flex-row md:flex-row flex-col justify-between w-[100%'>
            <p className='lg:w-[55%] md:w-[55%] w-[100%] font-[400]'>Create a loan request detailing your desired amount and terms. Your request will be visible to lenders, who can then choose to fund your loan.</p>
            <div className='ml-auto lg:w-[35%] md:w-[35%] w-[100%] mt-auto'>
              <CreateRequest />
            </div>
          </div>
        </div>
        <div className='bg-[#2a2a2a] lg:p-6 md:p-6 p-4 rounded-md lg:w-[30%] md:w-[30%] w-[100%] mb-4 shadow-lg border border-[#E0BB83]/30 flex'>
          <h3 className='text-[20px] font-playfair font-[700] my-4'>Credit <br /> Score</h3>
          <Gauge width={150} height={150} value={60} sx={() => ({
            [`& .${gaugeClasses.valueText}`]: {
              fontSize: 28,
              color: '#FFFFFF',
            },
            [`& .${gaugeClasses.valueArc}`]: {
              fill: '#E0BB83',
            }
          })}
          />
        </div>
      </section>
      <section>
        <h3 className='text-[20px] font-playfair font-[700] my-4 text-[#E0BB83]'>Overview</h3>
        <div className="flex lg:flex-row md:flex-row flex-col justify-between">
          <div className="bg-[#e0bb8314] shadow-lg border border-[#E0BB83]/30 p-6 rounded-lg w-[100%] lg:w-[19%] md:w-[19%] text-center mb-4">
            <h3>My Offers</h3>
            <p className="lg:text-[28px] md:text-[28px] text-[20px] font-bold">4</p>
          </div>
          <div className="bg-[#e0bb8314] shadow-lg border border-[#E0BB83]/30 p-6 rounded-lg w-[100%] lg:w-[19%] md:w-[19%] text-center mb-4">
            <h3>Active Loan</h3>
            <p className="lg:text-[28px] md:text-[28px] text-[20px] font-bold"><span>&#36;</span>4000</p>
          </div>
          <div className="bg-[#e0bb8314] shadow-lg border border-[#E0BB83]/30 p-6 rounded-lg w-[100%] lg:w-[19%] md:w-[19%] text-center mb-4">
            <h3>My Collateral</h3>
            <p className="lg:text-[28px] md:text-[28px] text-[20px] font-bold"><span>&#36;</span>4500</p>
          </div>
          <div className="bg-[#e0bb8314] shadow-lg border border-[#E0BB83]/30 p-6 rounded-lg w-[100%] lg:w-[19%] md:w-[19%] text-center mb-4">
            <h3>My Requests</h3>
            <p className="lg:text-[28px] md:text-[28px] text-[20px] font-bold">5</p>
          </div>
          <div className="bg-[#e0bb8314] shadow-lg border border-[#E0BB83]/30 p-6 rounded-lg w-[100%] lg:w-[19%] md:w-[19%] text-center mb-4">
            <h3>Repayment Amount</h3>
            <p className="lg:text-[28px] md:text-[28px] text-[20px] font-bold">&#36;5</p>
          </div>
        </div>
      </section>
      <section>
        <h3 className='text-[20px] font-playfair font-[700] my-4 text-[#E0BB83]'>Request Management</h3>
        <div className="flex justify-between flex-wrap">
          {isLoading ? <LoadingSpinner /> :
            userRequests?.length === 0 ? (
              <div className='flex flex-col items-center w-full my-8'>
                <RiFolderWarningFill className='text-[54px] mb-4 text-[#E0BB83]' />
                <h2 className='text-[18px] lg:text-[24px] md:text-[24px] mb-4'>No request yet!</h2>
              </div>
            ) : (userRequests.map((data, index) => {
              return (
                <div key={index} className="w-[100%] lg:w-[31%] md:w-[31%] rounded-lg border border-bg-ash/35 bg-bg-gray p-4 mt-6">
                  <Link to={`/dashboard/portfolio/${data?.id}`}>
                    <img src={requestImage} alt="" className="w-[100%] rounded-lg h-[200px] object-cover object-center mb-4" />
                    <p>Amount: {formatUnits(data?.amount, tokenList[data?.loanReq]?.decimals)}</p>
                    <p>Rate: {data?.interest.toString()}<span>&#37;</span></p>
                    <p>Repayment: {formatUnits(data?.repayment, tokenList[data?.loanReq]?.decimals + 1)}</p>
                    <p>Return date: <span>{(new Date(Number(data?.rDate) * 1000)).toLocaleString()}</span></p>
                  </Link>
                </div>
              )
            }
            ))}
        </div>
      </section>
      <section>
        <h3 className='text-[20px] font-playfair font-[700] my-4 text-[#E0BB83]'>Loan Repayment</h3>
      </section>
    </main>
  )
}

export default Portfolio