export type Cource = {
    cource_code: string;
    cource_points: number;
    cource_name: string;
}

type study_types = "Bachelornivå" | "Masternivå";

export type Exam = {
    cource_code: string;
    course_name: string;
    faculty: string;
    study_type: study_types;
    cource_requirements: string;
}