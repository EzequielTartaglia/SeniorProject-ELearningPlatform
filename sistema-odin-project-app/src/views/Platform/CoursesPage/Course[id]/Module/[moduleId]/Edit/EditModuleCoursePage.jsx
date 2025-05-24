import EditCourseModuleForm from "@/components/forms/platform/courses/course_modules/EditCourseModuleForm";

export default function EditModuleCoursePage({ courseId, moduleId }) {
  return  <EditCourseModuleForm courseId={courseId} moduleId={moduleId} />;
}
