-- Drop functions if they exist
DROP FUNCTION IF EXISTS public.update_questions_associated;
DROP FUNCTION IF EXISTS public.decrement_questions_associated;
DROP FUNCTION IF EXISTS update_final_exam_attempts_associated;

-- Drop triggers if they exist
DROP TRIGGER IF EXISTS increment_questions_associated ON public.course_final_exam_questions;
DROP TRIGGER IF EXISTS decrement_questions_associated_trigger ON public.course_final_exam_questions;
DROP TRIGGER IF EXISTS update_final_exam_attempts_associated_trigger ON public.student_course_enrollment_final_exam_attempt_tries;

-- Create or replace function to update questions_associated
CREATE OR REPLACE FUNCTION update_questions_associated()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE course_final_exams
    SET questions_associated = questions_associated + 1
    WHERE id = NEW.course_final_exam_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to increment questions_associated after insert
CREATE TRIGGER increment_questions_associated
AFTER INSERT ON course_final_exam_questions
FOR EACH ROW
EXECUTE FUNCTION update_questions_associated();

-- Create or replace function to decrement questions_associated
CREATE OR REPLACE FUNCTION decrement_questions_associated()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE course_final_exams
    SET questions_associated = questions_associated - 1
    WHERE id = OLD.course_final_exam_id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to decrement questions_associated after delete
CREATE TRIGGER decrement_questions_associated_trigger
AFTER DELETE ON course_final_exam_questions
FOR EACH ROW
EXECUTE FUNCTION decrement_questions_associated();

-- Create or replace function to update final exam attempts associated
CREATE OR REPLACE FUNCTION update_final_exam_attempts_associated()
RETURNS TRIGGER AS $$
BEGIN
    -- Update total_attempts and attempts_count_period in student_course_enrollment_final_exam_attempts
    UPDATE student_course_enrollment_final_exam_attempts
    SET total_attempts = total_attempts + 1,
        attempts_count_period = attempts_count_period + 1
    WHERE id = NEW.student_course_enrollment_final_exam_attempt_id;
    
    -- Check if attempts_count_period reaches 3 after the update
    IF (SELECT attempts_count_period FROM student_course_enrollment_final_exam_attempts WHERE id = NEW.student_course_enrollment_final_exam_attempt_id) >= 3 THEN
        -- Update is_lock to true and set lock_expiration_date 6 days in the future
        UPDATE student_course_enrollment_final_exam_attempts
        SET is_lock = TRUE,
            lock_expiration_date = CURRENT_DATE + INTERVAL '6 days'
        WHERE id = NEW.student_course_enrollment_final_exam_attempt_id;
    END IF;
    
    -- Update best_score if the new score is higher
    IF NEW.score > (SELECT best_score FROM student_course_enrollment_final_exam_attempts WHERE id = NEW.student_course_enrollment_final_exam_attempt_id) THEN
        UPDATE student_course_enrollment_final_exam_attempts
        SET best_score = NEW.score
        WHERE id = NEW.student_course_enrollment_final_exam_attempt_id;
    END IF;
    
    -- Check if the best_score meets or exceeds the min_score_to_pass percentage and update is_approved
    UPDATE student_course_enrollment_final_exam_attempts
    SET is_approved = (
        SELECT CASE 
            WHEN best_score >= (
                SELECT cfe.min_score_to_pass * total_points / 100
                FROM course_final_exams cfe
                JOIN courses c ON c.id = cfe.course_id
                JOIN student_course_enrollments sce ON sce.course_id = c.id
                JOIN (
                    SELECT course_final_exam_id, SUM(points_assigned) AS total_points
                    FROM course_final_exam_questions
                    GROUP BY course_final_exam_id
                ) cfq ON cfq.course_final_exam_id = cfe.id
                WHERE sce.id = student_course_enrollment_final_exam_attempts.student_course_enrollment_id
            ) THEN TRUE
            ELSE is_approved
        END
    )
    WHERE id = NEW.student_course_enrollment_final_exam_attempt_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update total_attempts in parent table after insert
CREATE TRIGGER update_final_exam_attempts_associated_trigger
AFTER INSERT ON student_course_enrollment_final_exam_attempt_tries
FOR EACH ROW
EXECUTE FUNCTION update_final_exam_attempts_associated();
