import AddCourseModuleClassForm from "@/components/forms/platform/courses/course_modules/course_module_classes/AddCourseModuleClassForm";

export default function NewCourseModuleClassPage({ courseId, moduleId }) {
  return <AddCourseModuleClassForm courseId={courseId} moduleId={moduleId} />;
}
