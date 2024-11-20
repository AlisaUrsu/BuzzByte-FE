import NavBar from "@/components/news_and_posts/NavBar";
import AddPostForm from "../../components/form/AddPostForm";

export default function AddPage() {
    return (
      <><NavBar /><div className="p-14 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]">

        <AddPostForm />
      </div></>
    );
}