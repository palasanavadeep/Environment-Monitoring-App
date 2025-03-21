import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { asyncHandler } from "./utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import Blog from "./models/Blog.js";
// import User from "./models/User.js";
import {verifyJWT} from "./routes/auth.js";
import User from "./models/usermodel.js";
import Mission from "./models/missions.js";
import {uploadOnCloudinary} from "./utils/cloudinary.js";
import {upload} from "./utils/multer.js"
import Community from "./models/community.js";
import Post from "./models/post.js"
import generateText from "./chatbot/gemini.js";
// import Mission from "./models/missions.js";
const app = express();
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ limit: "16kb", extended: true }));
// app.use(express.static("public"));
app.use(cookieParser());

const allowedOrigins = [process.env.CORS_ORIGIN, "http://localhost:5173", "http://localhost:8000","http://localhost:5174","http://localhost:5175","http://localhost:5176"];

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

// Route to generate text using Gemini API
app.post("/generate", async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
    }

    const response = await generateText(prompt);
    res.json({ response });
});


// ✅ Signup (with JWT token generation)
app.post("/signup", asyncHandler(async (req, res) => {
    console.log(req.body);

    const { username, email, password } = req.body;

    if ([username, password, email].some(field => field?.trim() === "")) {
        return res.status(400).json({ error: "Please enter all fields" });
    }

    const existedUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existedUser) return res.status(400).json({ error: "Username or Email already exists" });

    const user = await User.create({
        username: username.toLowerCase(),
        password,
        email,
    });

    if (!user) return res.status(500).json({ error: "Error saving user to database" });


    res.status(201).json({
        message: "Signup successful",
        user: { id: user._id, username: user.username, email: user.email }
    });
}));

// ✅ Signin (Token Already Implemented)
app.post("/signin", asyncHandler(async (req,res) => {
    
    const {email, password} = req.body;

    if(!email ){
        res.status(400).send("Username or Email is Required")
        // throw new ApiError(400,"Username or Email is Required");
    }
    if(!password){
        res.status.send("Password is required");
        // throw new ApiError(400,"Password is required");
    }
    // email or username based login
    const user = await User.findOne({
        email
    })

    if(!user){
        throw  new ApiError(404,"User Not Found");
    }

    // check password
    const validation = await user.isPasswordCorrect(password);
    if(!validation){
        throw  new ApiError(401,"Wrong Password");
    }

    // if password is correct then generate refresh token and  access token
    const {refreshToken , accessToken} = await generateRefreshAndAccessToken(user._id);

    const loggedUser = await User.findById(user._id).select("-password -refreshToken");

    const  options = {
        httpOnly : true,
        secure : true,
        sameSite: 'None'
    }

    return res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json({
        user : loggedUser,
        accessToken,
        refreshToken
    });

}));


const generateRefreshAndAccessToken = async(userId)=>{
    try{
        const user = await User.findById(userId);
        const accessToken =  user.generateAccessToken();
        const refreshToken =  user.generateRefreshToken();

        user.refreshToken = refreshToken;

        await user.save({ validateBeforeSave : false})

        return {refreshToken, accessToken};
    }catch{
        res.status(500).send("ERROR in generating Refresh Token and Access Token")
        // throw new ApiError(500,"ERROR in generating Refresh Token and Access Token");
    }

}

// Create a new blog
app.post("/blog/create" , verifyJWT , upload.single("blogImage") , asyncHandler(async (req, res) => {
        try {
            const { content , title   } = req.body;
            const  owner  = req?.user._id +"";
            const blogImagePath = req?.file?.path;

            console.log(content +"  " + title+" "+owner+" "+blogImagePath+" ");
            

            if([content , title , blogImagePath , owner].some((field) => field.trim() === "")){
                res.status(400).send("All fields are required !!");
            }

             // Validate owner existence
             const user = await User.findById(owner);
             if (!user) {
                 return res.status(404).json({ message: "User not found" });
             }

            const blogImage = await uploadOnCloudinary(blogImagePath);

            if(!blogImage){
                res.status(500).send("ERROR :: while uploading to cloudinary")
            }

            const blog = await Blog.create({
                owner,
                title,
                content,
                image : blogImage?.secure_url  || "N/A"
            });

            if(!blog){
                res.status(500).send("ERROR :: while inserting into DB")
            }

            res.status(201).json(blog);
        } catch (error) {
            res.status(500).json({ message: error.message + " 1232" });
        }
    }
))



// Fetch all blogs
app.get("/blog/all" , asyncHandler(async (req, res) => {
    try {
        const blogs = await Blog.find().populate("owner", "username email").sort({ createdAt: -1 });
        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).json({ message: error.message});
    }
}))

// Fetch a single blog by blog ID
app.get("/blog/:blogId" , asyncHandler(async (req, res) => {
    try {
        const { blogId } = req.params;
        console.log(blogId);
        
        const blog = await Blog.findById(blogId).populate("owner", "username email");

        blog.views+=1;
        await blog.save();


        if (!blog) {
            return res.status(404).json({ message: "Blog not found 3we3" });
        }

        res.status(200).json(blog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}))

// import Community from "../models/Community.js";
// import User from "../models/User.js";
import mongoose from "mongoose";
// import asyncHandler from "express-async-handler";

// Get all communities //verifiedInPostMan
app.get("/getCommunities/all",asyncHandler(async (req, res) => {
    const communities = await Community.find().populate("createdBy", "username email");
    res.status(200).json(communities);
}))

//Verified
app.post("/createCommunity",verifyJWT , upload.single("communityImage"), asyncHandler(async (req, res) => {
    try {
        const { name, description,theme } = req.body;
        const createdBy = req.user._id; // Assuming the user ID is extracted from JWT
        const communityImagePath = req?.file?.path;

        // Validate required fields
        if (!name || !description) {
            return res.status(400).json({ message: "Name and description are required" });
        }
        if(!communityImagePath){
            return res.status(400).json({ message: "Community Image is required" });
        }

        const communityImage = await uploadOnCloudinary(communityImagePath);

        if(!communityImage){
            res.status(500).send("ERROR :: while uploading to cloudinary")
        }

        // Check if community with the same name exists
        const existingCommunity = await Community.findOne({ name });
        if (existingCommunity) {
            return res.status(400).json({ message: "Community with this name already exists" });
        }

        // Create the community
        const community = await Community.create({
            name,
            theme,
            description,
            createdBy,
            image : communityImage?.secure_url || "",
            members: [createdBy] // Add creator as first member
        });

        res.status(201).json({
            message: "Community created successfully",
            community
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}))


// Get a community by ID //VErifiedPostMan
app.get("/getCommunity/:id", asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid community ID" });
        }

        // Fetch community and populate createdBy and posts
        const community = await Community.findById(id)
            .populate("createdBy", "username email")
            .populate("posts");

        if (!community) {
            return res.status(404).json({ message: "Community not found" });
        }

        res.status(200).json({
            ...community.toObject(),
            memberCount: community.members.length,
            posts: community.posts, // Include posts in the response
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}));



// Get communities the user has joined //verifiedInPostMan
app.get("/getUserCommunities",verifyJWT,asyncHandler(async (req, res) => {
    try {
        const userId  = req.user._id ;  // Extract userId from request parameters
        
        
        // Fetch communities where the user is a member
        const communities = await Community.find({ members: userId })
            .populate("createdBy", "username email");

        if (!communities || communities.length === 0) {
            return res.status(404).json({ message: "No communities found for this user" });
        }

        res.status(200).json(communities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}))



// Join a Community
app.post("/joinCommunity/:communityId",verifyJWT,asyncHandler(async (req, res) => {
    const { communityId } = req.params;
    const userId = req?.user._id; // Assuming user ID is extracted from JWT middleware

    if (!mongoose.Types.ObjectId.isValid(communityId)) {
        return res.status(400).json({ message: "Invalid community ID" });
    }

    const community = await Community.findById(communityId);
    if (!community) {
        return res.status(404).json({ message: "Community not found" });
    }

    // Check if user is already a member
    if (community.members.includes(userId)) {
        return res.status(400).json({ message: "User is already a member of this community" });
    }

    // Add user to members array
    community.members.push(userId);
    await community.save();

    res.status(200).json({ message: "Successfully joined the community", community });
}))

// Exit from a Community
app.post("/exitCommunity/:communityId",verifyJWT,asyncHandler(async (req, res) => {
    const { communityId } = req.params;
    const userId = req.user.id; // Assuming user ID is extracted from JWT middleware

    if (!mongoose.Types.ObjectId.isValid(communityId)) {
        return res.status(400).json({ message: "Invalid community ID" });
    }

    const community = await Community.findById(communityId);
    if (!community) {
        return res.status(404).json({ message: "Community not found" });
    }

    // Check if user is a member
    if (!community.members.includes(userId)) {
        return res.status(400).json({ message: "User is not a member of this community" });
    }

    // Remove user from members array
    community.members = community.members.filter(member => member.toString() !== userId);
    await community.save();

    res.status(200).json({ message: "Successfully exited the community", community });
}))

//ADD posts to community
// import Post from "../models/Post.js"; // Ensure correct path to Post model

app.post("/addPost/:communityId", verifyJWT, asyncHandler(async (req, res) => {
    try {
        const { communityId } = req.params;
        const { title, description } = req.body;
        const userId = req.user._id +""; // Extract user ID from JWT middleware
        // console.log(title,description);


        // Validate community ID
        if (!mongoose.Types.ObjectId.isValid(communityId)) {
            return res.status(400).json({ message: "Invalid community ID" });
        }
        // console.log(title,description);
        // Find the community
        const community = await Community.findById(communityId);
        if (!community) {
            return res.status(404).json({ message: "Community not found" });
        }
        // console.log(title,description);
        // Create a new post
        const newPost = new Post({
            owner: userId,
            title,
            description,
            image: "", // Optional field
            likes: 0, // Default value
        });
        // console.log(title,description);
        // Save the post
        const savedPost = await newPost.save();

        // Add post to the community's post list
        community.posts.push(savedPost._id);
        await community.save();
        // console.log(title,description);
        res.status(201).json({
            message: "Post added successfully",
            post: savedPost
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}));


app.post("/createMission",asyncHandler(async (req, res) => {
        try {
            const { title, description, points, coins, date } = req.body;
            
            if (!title || !description || !date) {
                return res.status(400).json({ message: "Title, description, and date are required" });
            }
            
            const parsedDate = new Date(date);
            if (isNaN(parsedDate.getTime())) {
                return res.status(400).json({ message: "Invalid date format" });
            }
            
            const newMission = await Mission.create({ title, description, points, coins, date: parsedDate });
            res.status(201).json({ message: "Mission created successfully", newMission });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }));

app.get( "/getMissionsByDate", asyncHandler(async (req, res) => {
    try {
        const { date } = req.query;
        
        if (!date) {
            return res.status(400).json({ message: "Date parameter is required" });
        }
        
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
            return res.status(400).json({ message: "Invalid date format" });
        }
        
       // Get start & end of the day in UTC
       const startOfDay = new Date(Date.UTC(parsedDate.getUTCFullYear(), parsedDate.getUTCMonth(), parsedDate.getUTCDate(), 0, 0, 0));
       const endOfDay = new Date(Date.UTC(parsedDate.getUTCFullYear(), parsedDate.getUTCMonth(), parsedDate.getUTCDate(), 23, 59, 59));

       console.log("Start of day:", startOfDay);
       console.log("End of day:", endOfDay);
        console.log(parsedDate);
        
       // Query within the date range
       const missions = await Mission.find({
           date: { $gte: startOfDay, $lte: endOfDay }
       });

        res.status(200).json(missions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}))

app.post("/completemission",verifyJWT,asyncHandler(async (req, res) => {
    try {
        const { missionId, userId } = req.body;
        const mission = await Mission.findById(missionId);
        const user = await User.findById(userId);
        
        
        if (!mission || !user) {
            return res.status(404).json({ message: "Mission or User not found" });
        }
        
        if (mission.completedPeople.includes(userId)) {
            return res.status(400).json({ message: "User already completed this mission" });
        }
       
        
        mission.completedPeople.push(userId);
        user.totalPoints += mission.points;
        user.crntPoints += mission.points;
        user.coins += mission.coins;
        
        const updatedMission = await Mission.findByIdAndUpdate(
            missionId, 
            { $push: { completedPeople: userId } }, 
            { new: true, useFindAndModify: false }
          );
        // await mission.save();
        await user.save();
        console.log(1);
        
        res.status(200).json({ message: "Mission completed successfully", mission, user });
    } catch (error) {
        res.status(500).json({ message: error.message +"478" });
    }
}))

app.get("/isMissionCompletedByUser/:missionId" ,verifyJWT,asyncHandler(async (req, res) => {
    try {
        const { missionId } = req.params;
        const userId = req.user?._id;
        const mission = await Mission.findById(missionId);
        
        if (!mission) {
            return res.status(404).json({ message: "Mission not found" });
        }
        
        const isCompleted = mission.completedPeople.includes(userId);
        res.status(200).json({ completed: isCompleted });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}))


app.get("/search/:query", asyncHandler(async (req, res) => {
    try {
        const { query } = req.params;
        const regex = new RegExp(query, "i");
        const result = {
            users: [],
            communities: [],
            posts: [],
            blogs: []
        };
        const communitiyResults = await Community.find({ name: regex },{members:0,posts:0});
        if(communitiyResults.length > 0){
            result.communities = communitiyResults;
        }
        const userResults = await User.find({ username: regex },{refreshToken : 0});
        if(userResults.length > 0){
            result.users = userResults;
        }
        const postResults = await Post.find({ title: regex });
        if(postResults.length > 0){
            result.posts = postResults;
        }
        const blogResults = await Blog.find({ title: regex },{description:0 , content:0});
        if(blogResults.length > 0){
            result.blogs = blogResults;
        }
        res.status(200).json(result);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}))




export  { app };
