CREATE TABLE test_results (
    id SERIAL PRIMARY KEY,
    patientid INTEGER NOT NULL,
    coordx: INTEGER[],
    coordy: INTEGER[],
    coordt: INTEGER[],
    realpointid: TEXT[],
    realpointx: DOUBLE PRECISION[],
    realpointy: DOUBLE PRECISION[],
    fakepointid: TEXT[],
    fakepointx: DOUBLE PRECISION[],
    fakepointy: DOUBLE PRECISION[]
);
