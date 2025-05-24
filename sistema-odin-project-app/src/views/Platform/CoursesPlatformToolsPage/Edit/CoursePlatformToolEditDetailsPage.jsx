import EditCoursePlatformToolForm from "@/components/forms/platform/course_platform_tools/EditCoursePlatformToolForm";

export default function CoursePlatformToolEditDetailsPage({
  coursePlatformToolId,
}) {
  return (
    <EditCoursePlatformToolForm coursePlatformToolId={coursePlatformToolId} />
  );
}
