const ContentType=require('../models/content-type');


const Content=async(req,res)=>{
        const{Name,ProjectName,ProjectCost}=req.body;

        if(Name&&ProjectName&&ProjectCost){
            try{
                const NewContent=new ContentType({
Name,
ProjectName,
ProjectCost

                })
                console.log("New Content",NewContent);
                NewContent.save();
                return res.status(200).json({
                    error:false,
                    message:"Content Save successfully..",
                    data:[NewContent]
                })



            }catch(error){
                res.status(404).json({
                    error:true,
                    message:"Internal Server error",

                })
            }
        }
        else{
            return res.status(400).json({
                error:true,
                message:"Something went wrong",
                data:[]
            })
        }
}

module.exports=Content;