import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ReviewSlider = () => {
    const settings = {
        // dots: true,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        speed: 2000,
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

    const reviewData = [
        {
            id: 1,
            name: 'Sarah Johnson',
            review: 'PeerLend made the lending process so straightforward and easy! I was able to get a loan quickly without the hassle of traditional banks. The platform is user-friendly, and the support team is very responsive. Highly recommended for anyone looking for a reliable P2P lending platform!'
        },
        {
            id: 2,
            name: 'Michael Lee',
            review: 'I was initially skeptical about using a P2P lending platform, but PeerLend exceeded my expectations. The security features and transparent processes gave me peace of mind. I was able to lend money with confidence, knowing my funds were secure.'
        },
        {
            id: 3,
            name: 'Sandra Chuks',
            review: 'As a small business owner, PeerLend has been a game-changer for me. The ability to quickly access funds without the lengthy approval processes of traditional banks has allowed me to keep my business running smoothly. The platform is intuitive, and the community is supportive.'
        },
        {
            id: 4,
            name: 'David bamidele',
            review: 'The collateralization process is clear, and I appreciate the additional layer of security it provides. It’s a great way to diversify my investment portfolio!'
        },
    ]

  return (
    <div className="slider-container lg:w-full m:w-full w-[90%] mx-auto h-auto mt-20">
    <Slider {...settings}>
    {reviewData.map((info) => (
        <div className='bg-[#0000004c] p-6 rounded-lg w-[100%]' key={info.id}>
            <p className="text-[14px] my-6">"{info.review}"</p>
            <p className="font-[700] font-playfair text-[#E0BB83]">{info.name}</p>
        </div>
    ))}
        </Slider>
    </div>
  )
}

export default ReviewSlider