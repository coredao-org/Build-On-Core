import Post from "@/components/Post";

const Home = () => {
  return (
    <>
      <div className="min-h-screen bg-[#14162E] justify-center items-center p-14 ml-[15vw] w-[60vw] flex flex-col">
        {/* Posts */}
        <Post
          content="Top GitHub repositories to learn modern React development. Open source is great for 
many things. One of them is learning new skills. In this article, we'll look at some of the best 
Open Source React projects on GitHub that you can use to quickly boost your hands-on React 
learning and coding experience."
          username="krishnav"
          img="/testimg.png"
        />
        <Post
          content="Top GitHub repositories to learn modern React development. Open source is great for 
many things. One of them is learning new skills. In this article, we'll look at some of the best 
Open Source React projects on GitHub that you can use to quickly boost your hands-on React 
learning and coding experience."
          username="krishnav"
          img="/testimg.png"
        />
        <Post
          content="Top GitHub repositories to learn modern React development. Open source is great for 
many things. One of them is learning new skills. In this article, we'll look at some of the best 
Open Source React projects on GitHub that you can use to quickly boost your hands-on React 
learning and coding experience."
          username="krishnav"
          img="/Character-falling.png"
        />
      </div>
    </>
  );
};

export default Home;
