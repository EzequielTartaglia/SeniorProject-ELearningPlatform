import ConditionalSessionRender from "@/src/helpers/ConditionalSessionRender";
import CourseFinalExamAttemptPage from "@/src/views/Platform/CoursesPage/Course[id]/FinalExamPage/FinalExamAttempt/CourseFinalExamAttemptPage";
import NotPermissionPage from "@/src/views/Platform/NotPermissionPage/NotPermissionPage";
import React from "react";

export default function FinalExamAttempt({ params }) {
  return (
    <ConditionalSessionRender
      ComponentIfUser={
        <CourseFinalExamAttemptPage
          courseId={params.id}
          finalExamId={params.finalExamId}
        />
      }
      ComponentIfNoUser={<NotPermissionPage />}
    />
  );
}
