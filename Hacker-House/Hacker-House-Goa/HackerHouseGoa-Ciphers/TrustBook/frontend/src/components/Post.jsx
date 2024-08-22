import React, { useState } from "react";
import { Button } from "./ui/button";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { RiShareForwardLine } from "react-icons/ri";
import { MdReportProblem } from "react-icons/md";
import { Input } from "./ui/input";

const Post = ({ username, content, img, pfg }) => {
  const [liked, setLiked] = useState(false);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [reported, setReported] = useState(false);

  const handleAddComment = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      setComments([
        ...comments,
        { username: "Current User", content: newComment },
      ]);
      setNewComment("");
    }
  };

  return (
    <div className="flex my-2 text-white w-[50vw] p-12 min-h-[40vh] flex-col bg-[#1D1932] justify-center items-start rounded-2xl">
      <div className="flex items-center gap-3 w-full justify-between">
        <div className="flex items-center gap-3">
          <div className="overflow-hidden w-[2vw] border-2 border-white aspect-square rounded-full">
            <img
              className="w-[12vw]"
              src="/Character-falling.png"
              alt="Profile"
            />
          </div>
          <span>{username}</span>
        </div>
        <Button
          variant="ghost"
          className={`flex items-center gap-2 ${
            reported ? "text-red-500" : "text-white"
          }`}
          onClick={() => setReported(!reported)}
        >
          <MdReportProblem />
          Report
        </Button>
      </div>

      {/* Content */}
      <p className="my-2">{content}</p>

      {!!img && (
        <div className="aspect-video border-2 w-[45vw] overflow-hidden rounded-2xl">
          <img
            className="object-cover aspect-video h-[27vw]"
            src={img}
            alt="Post image"
          />
        </div>
      )}

      {/* Action buttons */}
      <div className="flex justify-between w-full mt-4">
        <Button
          variant="ghost"
          className="flex items-center gap-2"
          onClick={() => setLiked(!liked)}
        >
          {liked ? <AiFillLike className="text-blue-500" /> : <AiOutlineLike />}
          Like
        </Button>
        <Button
          variant="ghost"
          className="flex items-center gap-2"
          onClick={() => setShowCommentBox(!showCommentBox)}
        >
          <FaRegComment />
          Comment
        </Button>
        <Button variant="ghost" className="flex items-center gap-2">
          <RiShareForwardLine />
          Share
        </Button>
      </div>

      {/* Comments section */}
      <div className="w-full mt-4">
        {comments.map((comment, index) => (
          <div key={index} className="bg-[#14162E] p-2 rounded-md mb-2">
            <span className="font-bold">{comment.username}: </span>
            <span>{comment.content}</span>
          </div>
        ))}
      </div>

      {/* Comment box */}
      {showCommentBox && (
        <form onSubmit={handleAddComment} className="w-full mt-4">
          <Input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="bg-[#14162E] border-none text-white"
          />
          <Button
            type="submit"
            className="mt-2 bg-[#6F4FF2] hover:bg-[#462caf]"
          >
            Post Comment
          </Button>
        </form>
      )}
    </div>
  );
};

export default Post;
