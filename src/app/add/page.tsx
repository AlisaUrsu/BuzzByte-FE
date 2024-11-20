import MyForm from "../AddPost";

export default function AddPage() {
    return (
        <div className="max-w-3xl mx-auto py-10">
        <h1 className="text-2xl font-bold mb-4">Add a New Post</h1>
        <MyForm /> {/* Render the form */}
      </div>
    );
}