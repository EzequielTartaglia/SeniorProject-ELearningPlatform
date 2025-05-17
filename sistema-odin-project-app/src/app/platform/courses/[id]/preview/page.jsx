import CoursePreviewPage from "@/src/views/Platform/CoursesPage/Course[id]/Preview/CoursePreviewPage";


export default function CoursePreview({params}) {
  return (
    <CoursePreviewPage courseId={params.id}/>
  )
}
