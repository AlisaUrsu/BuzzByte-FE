import React from "react";
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "@/components/ui/extension/multi-select";

const tags = [
  "JavaScript", "Python", "Java", "C#", "C++",
  "Ruby", "Go", "Rust", "TypeScript", "PHP",
  "Swift", "Kotlin", "Dart", "HTML & CSS",
  "React", "Angular", "Vue.js", "Svelte", "Ember.js",
  "Node.js", "Express.js", "Laravel", "Django", "Flask",
  "Spring Boot", "ASP.NET",
  "SQL", "NoSQL", "MongoDB", "PostgreSQL", "MySQL",
  "Firebase", "GraphQL",
  "AWS (Amazon Web Services)", "Google Cloud", "Azure",
  "Docker", "Kubernetes", "Serverless Architecture",
  "Continuous Integration (CI/CD)", "DevOps",
  "Progressive Web Apps (PWAs)", "REST APIs",
  "Microservices", "HTTP/HTTPS", "WebAssembly",
  "Agile Methodology", "Scrum", "Kanban",
  "Test-Driven Development (TDD)", "Pair Programming",
  "Machine Learning", "Deep Learning", "Neural Networks",
  "Natural Language Processing (NLP)", "Computer Vision",
  "Reinforcement Learning",
  "Data Science", "Data Visualization", "Big Data",
  "Business Intelligence", "Predictive Analytics",
];

export default function TagsSelector({
  selectedTags,
  setSelectedTags,
}: {
  selectedTags: string[];
  setSelectedTags: (categories: string[]) => void;
}) {
  return (
    <MultiSelector
      values={selectedTags}
      onValuesChange={setSelectedTags}
      loop
      className="max-w-xs"
    >
      <MultiSelectorTrigger>
        <MultiSelectorInput placeholder="Select categories" />
      </MultiSelectorTrigger>
      <MultiSelectorContent>
        <MultiSelectorList>
          {tags.map((tags) => (
            <MultiSelectorItem key={tags} value={tags}>
              {tags}
            </MultiSelectorItem>
          ))}
        </MultiSelectorList>
      </MultiSelectorContent>
    </MultiSelector>
  );
}
