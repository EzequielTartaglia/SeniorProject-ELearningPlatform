import EditCourseModuleClassForm from "@/components/forms/platform/courses/course_modules/course_module_classes/EditCourseModuleClassForm";

export default function EditModuleCourseClassPage({
  courseId,
  moduleId,
  classId,
}) {
  return (
    <EditCourseModuleClassForm
      courseId={courseId}
      moduleId={moduleId}
      classId={classId}
    />
  );
}
