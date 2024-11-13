import { useState } from "react";
import { Button } from "@/components/ui/button"

type ButtonProps = {
    label: string;
    selected: boolean;
    onClick: () => void;
};

const CategoryPickButton = ({ label, selected, onClick }: ButtonProps) => {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 m-1 rounded-full ${selected ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-800"
                }`}
        >
            {label}
        </button>
    );
};

type CategoryPickPageProps = {
    onSubmit: (categories: string[]) => void
}

const CategoryPickPage = ({ onSubmit }: CategoryPickPageProps) => {
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    //hardcoded categories to test desgin

    const categories = [
        // Programming Languages
        "JavaScript", "Python", "Java", "C#", "C++",
        "Ruby", "Go", "Rust", "TypeScript", "PHP",
        "Swift", "Kotlin", "Dart", "HTML & CSS",

        // Frontend Frameworks & Libraries
        "React", "Angular", "Vue.js", "Svelte", "Ember.js",

        // Backend Frameworks & Libraries
        "Node.js", "Express.js", "Laravel", "Django", "Flask",
        "Spring Boot", "ASP.NET",

        // Databases
        "SQL", "NoSQL", "MongoDB", "PostgreSQL", "MySQL",
        "Firebase", "GraphQL",

        // Cloud & Infrastructure
        "AWS (Amazon Web Services)", "Google Cloud", "Azure",
        "Docker", "Kubernetes", "Serverless Architecture",
        "Continuous Integration (CI/CD)", "DevOps",

        // Web Development
        "Progressive Web Apps (PWAs)", "REST APIs",
        "Microservices", "HTTP/HTTPS", "WebAssembly",

        // Software Development Methodologies
        "Agile Methodology", "Scrum", "Kanban",
        "Test-Driven Development (TDD)", "Pair Programming",

        // Artificial Intelligence & Machine Learning
        "Machine Learning", "Deep Learning", "Neural Networks",
        "Natural Language Processing (NLP)", "Computer Vision",
        "Reinforcement Learning",

        // Data Science & Analytics
        "Data Science", "Data Visualization", "Big Data",
        "Business Intelligence", "Predictive Analytics"
    ];


    const toggleCategory = (category: string) => {
        setSelectedCategories((prev) =>
            prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
        );
    };

    return (
        <div className="w-full min-h-[60%] px-10">
            <div className="flex-1 flex flex-col justify-center items-center text-white p-8">
                <h1 className="text-4xl font-semibold mb-4">Find content that interests you</h1>
                <p className="text-lg text-center">
                    Choose at least 5 categories
                </p>
            </div>

            <div className="border rounded-lg shadow-md p-4 bg-white">

                <div className="flex justify-center">
                    <h2 className="text-lg font-semibold">Selected Categories</h2>
                </div>

                <div className="flex flex-wrap mb-2 h-10">
                    {selectedCategories.map((category) => (
                        <span key={category} className="bg-purple-900 text-white px-3 py-1 rounded-full m-1">
                            {category}
                        </span>
                    ))}
                </div>

                <hr className="m-3"></hr>
                <div className="flex justify-center"><h2 className="text-lg font-semibold">Select More</h2></div>


                <div className="flex justify-center">
                    <div className="overflow-auto min-h-40 ">
                        {categories.map((category) => (
                            <CategoryPickButton
                                key={category}
                                label={category}
                                selected={selectedCategories.includes(category)}
                                onClick={() => toggleCategory(category)}
                            />
                        ))}
                    </div>
                </div>

                <div className="m-5 flex justify-end">
                    <Button type="submit" disabled={selectedCategories.length < 5} onClick={() => onSubmit(selectedCategories)}>Submit</Button>
                </div>

            </div>
        </div>
    );
};

export default CategoryPickPage;
