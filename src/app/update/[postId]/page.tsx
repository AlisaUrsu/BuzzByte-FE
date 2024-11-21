import UpdatePostForm from "@/components/form/UpdatePostForm";
import NavBar from "@/components/news_and_posts/NavBar";

export default async function UpdatePostPage({ params }: { params: { postId: string } }) {
  const { postId } = await params;

  return (
    <><NavBar /><div className="p-14 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]">
      <UpdatePostForm postId={postId} />
    </div></>
  );
} 