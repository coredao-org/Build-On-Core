import React from 'react'
import bgImg from '../assets/bg.png'
import spinnerImg from '../assets/spinner.svg'
import phone from '../assets/screens.svg'
import pIcon from '../assets/p2p.png'
import securityIcon from '../assets/sec.png'
import optIcon from '../assets/opt.png'
import walletScreen from '../assets/wallet.png'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ReviewSlider from '../components/ReviewSlider'
import worldBg from '../assets/connect.png'
import Faqs from '../components/Faqs'
import Header from '../components/Header'
import Footer from '../components/Footer'

const Home = () => {
    const settings = {
        // dots: true,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        speed: 5000,
        autoplaySpeed: 5000,
        cssEase: "linear",
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    initialSlide: 2,
                    dots: false,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    dots: false,
                },
            },
        ]
    };

    const imageData = [
        {
            id: 1,
            imageLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Chainlink_Logo_Blue.svg/2560px-Chainlink_Logo_Blue.svg.png'
        },
        {
            id: 2,
            imageLogo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQtCSGWlBt97s8tbJGhTAsfO7yOBemR9Y9-w&s'
        },
        {
            id: 3,
            imageLogo: 'https://d26zjke7m1t6hh.cloudfront.net/static/metadata_logos/solidityIntroSymbolLogo.webp'
        },
        {
            id: 4,
            imageLogo: 'https://seeklogo.com/images/E/ethereum-logo-EC6CDBA45B-seeklogo.com.png'
        },
        {
            id: 5,
            imageLogo: './web3.jpeg'
        },
        {
            id: 6,
            imageLogo: './gitcoin.png'
        },
    ]

    return (
        <main>
            <Header />
            <section className='bg-gradient-to-r from-[#2a2a2a] via-[#2a2a2a] to-[#E0BB83]/30 py-20'>
                <div className='flex justify-between lg:flex-row md:flex-row flex-col'>
                    <div className='w-[100%] lg:w-[37%] md:w-[37%] mx-auto lg:mt-24 md:mt-24 p-6 lg:p-0 md:p-0'>
                        <h1 className="lg:text-[64px] md:text-[64px] text-[36px] font-bold font-playfair">Peer Power, Fast<br /> <span className='text-[#E0BB83]'>Funds</span> </h1>
                        <p className='font-[100] font-roboto-serif my-6 lg:text-[20px] md:text-[20px] text-[16px] lg:leading-10 md:leading-10 leading-8'>Seamlessly connect with borrowers and investors on our P2P lending platform, offering deep liquidity and secure transactions for efficient financial solutions.</p>
                        <button className='bg-[#E0BB83] py-2 px-6 rounded-lg text-[#2a2a2a] font-[700] text-[18px] font-playfair lg:w-[50%] md:w-[50%] w-[100%]'>Get Started</button>
                    </div>
                    <div className='w-[100%] lg:w-[50%] md:w-[50%] pl-6  lg:p-0 md:p-0 my-8 lg:my-0 md:my-0'>
                        <img src={bgImg} alt="" className="transform -scale-x-100 w-[100%]" />
                    </div>
                </div>
                <div className='flex justify-between items-center lg:w-[85%] md:w-[85%] w-[90%]  mx-auto mt-12 lg:flex-row md:flex-row flex-col'>
                    <div className='lg:w-[25%] md:w-[25%] w-[100%] self-baseline'>
                        <p className='text-[18px] font-[700] text-[#E0BB83]'>01. Automated Lending</p>
                        <p className='text-[16px] my-4'>Smart contracts define the rules for lending, including collateral requirements, interest rates, and repayment conditions.
                        </p>
                    </div>
                    <div className='lg:w-[25%] md:w-[25%] w-[100%] self-baseline'>
                        <p className='text-[18px] font-[700] text-[#E0BB83]'>02. Smooth Onboarding</p>
                        <p className='text-[16px] my-4'>Ensures a smooth onboarding process, enabling users to manage their lending and borrowing activities efficiently.
                        </p>
                    </div>
                    <div className='lg:w-[25%] md:w-[25%] w-[100%] self-baseline'>
                        <p className='text-[18px] font-[700] text-[#E0BB83]'>03. Tokenized Assets</p>
                        <p className='text-[16px] my-4'>Allows for the division and fractional ownership of these assets. This makes it easier to facilitate smaller loans and increases liquidity</p>
                    </div>
                    <div className='lg:w-[19%] md:w-[19%] w-[100%]'>
                        <img src={spinnerImg} alt="" className='w-[100%] lg:w-[80%] md:w-[80%] mx-auto animate-spin-slow' />
                    </div>
                </div>
            </section>
            <section className='lg:w-[85%] md:w-[85%] w-[100%] mx-auto justify-between flex lg:flex-row md:flex-row flex-col py-6 px-6 lg:px-0 md:px-0'>
                <div className='lg:w-[50%] md:w-[50%] w-[100%] lg:order-1 md:order-1 order-2'>
                    <img src={phone} alt="" className='lg:w-[90%] mx-auto' />
                </div>
                <div className='lg:w-[47%] md:w-[47%] w-[100%] text-center lg:text-left md:text-left mt-8 lg:order-2 md:order-2 order-1'>
                    <h2 className="lg:text-[46px] md:text-[46px] text-[28px] font-bold font-playfair mb-4">About <span className='text-[#E0BB83]'>PeerLend</span></h2>
                    <div className='flex justify-between flex-wrap lg:flex-row md:flex-row flex-col lg:mt-20 md:mt-20 mt-8'>
                        <div className='lg:w-[48%] md:w-[48%] w-[100%] mb-6 flex flex-col lg:items-start md:items-start items-center'>
                            <img src={pIcon} alt="" className='w-[60px] h-[60px]' />
                            <h2 className='text-[#E0BB83] font-playfair font-[700] text-[18px] my-4'>Direct Connection</h2>
                            <p className='text-[14px]'>PeerLend eliminates the need for traditional banks by allowing borrowers and lenders to interact directly. This peer-to-peer model provides more flexible terms and potentially better rates for both parties.</p>
                        </div>
                        <div className='lg:w-[48%] md:w-[48%] w-[100%] mb-6 flex flex-col lg:items-start md:items-start items-center'>
                            <img src={securityIcon} alt="" className='w-[60px] h-[60px]' />
                            <h2 className='text-[#E0BB83] font-playfair font-[700] text-[18px] my-4'>Secured and Transparent</h2>
                            <p className='text-[14px]'>All transactions on PeerLend are secured by blockchain technology, ensuring transparency and trust. Users can view transaction histories and verify details, promoting a transparent lending environment.</p>
                        </div>
                        <div className='lg:w-[48%] md:w-[48%] w-[100%] mb-6 flex flex-col lg:items-start md:items-start items-center'>
                            <img src={optIcon} alt="" className=' w-[60px] h-[60px]' />
                            <h2 className='text-[#E0BB83] font-playfair font-[700] text-[18px] my-4'>Flexible Loan Options</h2>
                            <p className='text-[14px]'>Whether you need a small personal loan or a larger business loan, PeerLend offers various loan sizes to meet diverse financial needs. Borrowers can customize loan terms to suit their specific requirements.</p>
                        </div>
                        <div className='lg:w-[48%] md:w-[48%] w-[100%] mb-6 flex flex-col lg:items-start md:items-start items-center'>
                            <img src={pIcon} alt="" className='w-[60px] h-[60px]' />
                            <h2 className='text-[#E0BB83] font-playfair font-[700] text-[18px] my-4'>Financial Inclusion</h2>
                            <p className='text-[14px]'>PeerLend opens up lending opportunities to individuals who might not qualify for traditional loans. By leveraging decentralized finance (DeFi), the platform promotes financial inclusion, allowing more people to access credit.</p>
                        </div>
                    </div>
                </div>
            </section>
            <section className='lg:w-[85%] md:w-[85%] w-[100%] mx-auto flex justify-between lg:flex-row md:flex-row flex-col py-16 px-6 md:px-0 '>
                <div className='lg:w-[65%] md:w-[65%] w-[100%] text-center lg:text-left md:text-left mt-8'>
                    <h2 className="lg:text-[46px] md:text-[46px] text-[28px] font-bold font-playfair mb-4">How Does our<span className='text-[#E0BB83]'> Process </span>Work</h2>
                    <div className='flex justify-between flex-wrap lg:flex-row md:flex-row flex-col lg:mt-12 md:mt-12 mt-8'>
                        <div className='lg:w-[48%] md:w-[48%] w-[100%] mb-6 flex flex-col lg:items-start md:items-start items-center'>
                            <h2 className='text-[#E0BB83] font-playfair font-[700] text-[18px] my-4'>01. Connect Wallet</h2>
                            <p className='text-[14px]'> Create an account on PeerLend by connecting your digital wallet and verifying your email to ensure the security and authenticity of all users.</p>
                        </div>
                        <div className='lg:w-[48%] md:w-[48%] w-[100%] mb-6 flex flex-col lg:items-start md:items-start items-center'>
                            <h2 className='text-[#E0BB83] font-playfair font-[700] text-[18px] my-4'>02. Add Collateral</h2>
                            <p className='text-[14px]'>  Secure your loan on PeerLend by collateralizing a portion of your funds. By providing collateral, you reduce the risk for lenders, which can help you secure better loan terms and lower interest rates.</p>
                        </div>
                        <div className='lg:w-[48%] md:w-[48%] w-[100%] mb-6 flex flex-col lg:items-start md:items-start items-center'>
                            <h2 className='text-[#E0BB83] font-playfair font-[700] text-[18px] my-4'>03. Request or Offer a Loan:</h2>
                            <p className='text-[14px]'>Borrowers can submit loan requests detailing their needs and terms, while lenders can browse and choose loan opportunities that fit their investment criteria..</p>
                        </div>
                        <div className='lg:w-[48%] md:w-[48%] w-[100%] mb-6 flex flex-col lg:items-start md:items-start items-center'>
                            <h2 className='text-[#E0BB83] font-playfair font-[700] text-[18px] my-4'>04. Smart Contract Execution:</h2>
                            <p className='text-[14px]'>A smart contract is automatically executed on the blockchain, securing the transaction and ensuring both parties adhere to the agreed terms of supply and repayment.</p>
                        </div>
                    </div>
                </div>
                <div className='lg:w-[30%] md:w-[30%] w-[100%]'>
                    <img src={walletScreen} alt="" className='lg:w-[80%] mx-auto' />
                </div>
            </section>
            <section className='lg:w-[85%] w-[80%] mx-auto'>
                <h2 className="lg:text-[46px] md:text-[46px] text-[28px] font-bold font-playfair mb-4 text-center lg:text-left md:text-left">Meet our<span className='text-[#E0BB83]'> Partners </span></h2>
                <div className="slider-container lg:w-full md:w-full w-[90%] mx-auto h-auto mt-20">
                    <Slider {...settings}>
                        {imageData.map((index, info) => (
                            <div className='' key={index}>
                                <img src={info.imageLogo} alt="" className='w-[200px] rounded-lg' />
                            </div>
                        ))}
                    </Slider>
                </div>
            </section>
            <section className='my-12 bg-gradient-to-r from-[#E0BB83]/10 via-[#2a2a2a] to-[#2a2a2a] py-20 ' >
                <div style={{ backgroundImage: `url(${worldBg})` }} className='lg:bg-right-0  md:bg-right-0 bg-no-repeat bg-contain bg-bottom-0'>
                    <div className='lg:w-[85%] md:w-[85%] w-[90%] mx-auto'>
                        <h2 className="lg:text-[46px] md:text-[46px] text-[28px] font-bold font-playfair mb-4 w-[90%] lg:w-[50%] md:w-[50%]">Join the growing community of users who trust PeerLend, the new and innovative<span className='text-[#E0BB83]'> P2P lending platform</span></h2>
                        <div className='lg:w-[40%] md:w-[40%] w-[90%] mx-auto lg:mx-0 md:mx-0'>
                            <ReviewSlider />
                        </div>
                    </div>
                </div>
            </section>
            <section className='lg:w-[85%] md:w-[85%] w-[90%] mx-auto flex lg:flex-row md:flex-row flex-col justify-between my-16'>
                <div className='text-[16px]lg:w-[40%] md:w-[40%] w-[100%] mb-6'>
                    <h2 className="lg:text-[46px] md:text-[46px] text-[28px] font-bold font-playfair">Still have a <span className='text-[#E0BB83]'>question</span>?</h2>
                    <p className='mb-4 lg:text-[18px] md:text-[18px] text-[14px] uppercase font-[400]'>Send us a Message</p>
                    <div className='flex flex-col'>
                        <input type="text" placeholder='Name' className='border-b border-[#E0BB83] bg-transparent outline-none py-2 px-6 my-2' />
                        <input type="text" placeholder='Email Address' className='border-b border-[#E0BB83] bg-transparent outline-none py-2 px-6 my-2' />
                        <input type="text" placeholder='Phone Number' className='border-b border-[#E0BB83] bg-transparent outline-none py-2 px-6 my-2' />
                        <textarea name="" id="" placeholder='Message' className='border-b border-[#E0BB83] bg-transparent outline-none py-2 px-6 my-2' />
                        <button className='bg-[#E0BB83] py-2 px-6 rounded-lg text-[#2a2a2a] font-[700] text-[18px] font-playfair my-6 w-[100%]'>Submit</button>
                    </div>
                </div>
                <div className='lg:w-[50%] md:w-[50%] w-[100%] mb-6'>
                    <h2 className="lg:text-[46px] md:text-[46px] text-[28px] font-bold font-playfair">Frequently asked <span className='text-[#E0BB83]'>question</span></h2>
                    <Faqs />
                </div>
            </section>
            <Footer />
        </main>
    )
}

export default Home