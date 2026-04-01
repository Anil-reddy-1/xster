export const programs = [
    { id: 1, code: "BTECH", name: "Bachelor of Technology" },
    { id: 2, code: "MTECH", name: "Master of Technology" },
    { id: 3, code: "MBA", name: "Master of Business Administration" }
];

export const departments = [
    { id: 1, code: "CSE", name: "Computer Science and Engineering" },
    { id: 2, code: "ECE", name: "Electronics and Communication Engineering" },
    { id: 3, code: "CSD", name: "Computer Science and Design" },
    { id: 4, code: "CSM", name: "Computer Science (AI & ML)" },
    { id: 5, code: "EEE", name: "Electrical and Electronics Engineering" }
];

export const academicYears = [
    { id: 1, year_no: 1, label: "Year 1" },
    { id: 2, year_no: 2, label: "Year 2" },
    { id: 3, year_no: 3, label: "Year 3" },
    { id: 4, year_no: 4, label: "Year 4" }
];


export const labs = [
    // --- Year 1 (Common & Foundation) ---
    // CSE
    { id: 1, program_id: 1, department_id: 1, academic_year_id: 1, lab_name: "C-Programming Lab", lab_code: "CSE1101", weeks: 12 },
    { id: 2, program_id: 1, department_id: 1, academic_year_id: 1, lab_name: "IT Workshop", lab_code: "CSE1102", weeks: 12 },
    // ECE
    { id: 3, program_id: 1, department_id: 2, academic_year_id: 1, lab_name: "Basic Electrical & Electronics Lab", lab_code: "ECE1101", weeks: 12 },
    { id: 4, program_id: 1, department_id: 2, academic_year_id: 1, lab_name: "C-Programming Lab", lab_code: "ECE1102", weeks: 12 },
    // CSD
    { id: 5, program_id: 1, department_id: 3, academic_year_id: 1, lab_name: "Engineering Graphics Lab", lab_code: "CSD1101", weeks: 12 },
    { id: 6, program_id: 1, department_id: 3, academic_year_id: 1, lab_name: "C-Programming Lab", lab_code: "CSD1102", weeks: 12 },
    // CSM
    { id: 7, program_id: 1, department_id: 4, academic_year_id: 1, lab_name: "IT Workshop", lab_code: "CSM1101", weeks: 12 },
    { id: 8, program_id: 1, department_id: 4, academic_year_id: 1, lab_name: "C-Programming Lab", lab_code: "CSM1102", weeks: 12 },
    // EEE
    { id: 9, program_id: 1, department_id: 5, academic_year_id: 1, lab_name: "Basic Electronics Lab", lab_code: "EEE1101", weeks: 12 },
    { id: 10, program_id: 1, department_id: 5, academic_year_id: 1, lab_name: "Electrical Circuits Lab", lab_code: "EEE1102", weeks: 12 },

    // --- Year 2 (Core Fundamentals) ---
    // CSE
    { id: 11, program_id: 1, department_id: 1, academic_year_id: 2, lab_name: "Data Structures Lab", lab_code: "CSE2101", weeks: 12 },
    { id: 12, program_id: 1, department_id: 1, academic_year_id: 2, lab_name: "Java Programming Lab", lab_code: "CSE2102", weeks: 12 },
    { id: 13, program_id: 1, department_id: 1, academic_year_id: 2, lab_name: "DBMS Lab", lab_code: "CSE2103", weeks: 12 },
    { id: 14, program_id: 1, department_id: 1, academic_year_id: 2, lab_name: "Operating Systems Lab", lab_code: "CSE2104", weeks: 12 },
    // ECE
    { id: 15, program_id: 1, department_id: 2, academic_year_id: 2, lab_name: "Electronic Devices & Circuits Lab", lab_code: "ECE2101", weeks: 12 },
    { id: 16, program_id: 1, department_id: 2, academic_year_id: 2, lab_name: "Digital Logic Design Lab", lab_code: "ECE2102", weeks: 12 },
    { id: 17, program_id: 1, department_id: 2, academic_year_id: 2, lab_name: "Analog Communications Lab", lab_code: "ECE2103", weeks: 12 },
    // CSD
    { id: 18, program_id: 1, department_id: 3, academic_year_id: 2, lab_name: "Data Structures Lab", lab_code: "CSD2101", weeks: 12 },
    { id: 19, program_id: 1, department_id: 3, academic_year_id: 2, lab_name: "Computer Organization Lab", lab_code: "CSD2102", weeks: 12 },
    { id: 20, program_id: 1, department_id: 3, academic_year_id: 2, lab_name: "DBMS Lab", lab_code: "CSD2103", weeks: 12 },
    // CSM
    { id: 21, program_id: 1, department_id: 4, academic_year_id: 2, lab_name: "Python Programming Lab", lab_code: "CSM2101", weeks: 12 },
    { id: 22, program_id: 1, department_id: 4, academic_year_id: 2, lab_name: "Data Structures Lab", lab_code: "CSM2102", weeks: 12 },
    { id: 23, program_id: 1, department_id: 4, academic_year_id: 2, lab_name: "OS & Linux Lab", lab_code: "CSM2103", weeks: 12 },
    // EEE
    { id: 24, program_id: 1, department_id: 5, academic_year_id: 2, lab_name: "Electrical Machines-I Lab", lab_code: "EEE2101", weeks: 12 },
    { id: 25, program_id: 1, department_id: 5, academic_year_id: 2, lab_name: "Control Systems Lab", lab_code: "EEE2102", weeks: 12 },
    { id: 26, program_id: 1, department_id: 5, academic_year_id: 2, lab_name: "Electrical Measurements Lab", lab_code: "EEE2103", weeks: 12 },

    // --- Year 3 (Advanced Core) ---
    // CSE
    { id: 27, program_id: 1, department_id: 1, academic_year_id: 3, lab_name: "Computer Networks Lab", lab_code: "CSE3101", weeks: 12 },
    { id: 28, program_id: 1, department_id: 1, academic_year_id: 3, lab_name: "Web Technologies Lab", lab_code: "CSE3102", weeks: 12 },
    { id: 29, program_id: 1, department_id: 1, academic_year_id: 3, lab_name: "AI & ML Lab", lab_code: "CSE3103", weeks: 12 },
    // ECE
    { id: 30, program_id: 1, department_id: 2, academic_year_id: 3, lab_name: "Microprocessors & Microcontrollers Lab", lab_code: "ECE3101", weeks: 12 },
    { id: 31, program_id: 1, department_id: 2, academic_year_id: 3, lab_name: "VLSI Design Lab", lab_code: "ECE3102", weeks: 12 },
    { id: 32, program_id: 1, department_id: 2, academic_year_id: 3, lab_name: "Digital Signal Processing Lab", lab_code: "ECE3103", weeks: 12 },
    // CSD
    { id: 33, program_id: 1, department_id: 3, academic_year_id: 3, lab_name: "UI/UX Design Lab", lab_code: "CSD3101", weeks: 12 },
    { id: 34, program_id: 1, department_id: 3, academic_year_id: 3, lab_name: "Web Technologies Lab", lab_code: "CSD3102", weeks: 12 },
    // CSM
    { id: 35, program_id: 1, department_id: 4, academic_year_id: 3, lab_name: "Machine Learning Lab", lab_code: "CSM3101", weeks: 12 },
    { id: 36, program_id: 1, department_id: 4, academic_year_id: 3, lab_name: "Data Analytics using R Lab", lab_code: "CSM3102", weeks: 12 },
    // EEE
    { id: 37, program_id: 1, department_id: 5, academic_year_id: 3, lab_name: "Power Systems Lab", lab_code: "EEE3101", weeks: 12 },
    { id: 38, program_id: 1, department_id: 5, academic_year_id: 3, lab_name: "Power Electronics Lab", lab_code: "EEE3102", weeks: 12 },

    // --- Year 4 (Specialization & Projects) ---
    // CSE
    { id: 39, program_id: 1, department_id: 1, academic_year_id: 4, lab_name: "Cloud Computing Lab", lab_code: "CSE4101", weeks: 12 },
    { id: 40, program_id: 1, department_id: 1, academic_year_id: 4, lab_name: "Major Project Phase I", lab_code: "CSE4102", weeks: 12 },
    // ECE
    { id: 41, program_id: 1, department_id: 2, academic_year_id: 4, lab_name: "Microwave & Optical Comm Lab", lab_code: "ECE4101", weeks: 12 },
    { id: 42, program_id: 1, department_id: 2, academic_year_id: 4, lab_name: "Embedded Systems Lab", lab_code: "ECE4102", weeks: 12 },
    // CSD
    { id: 43, program_id: 1, department_id: 3, academic_year_id: 4, lab_name: "Interactive Computer Graphics Lab", lab_code: "CSD4101", weeks: 12 },
    { id: 44, program_id: 1, department_id: 3, academic_year_id: 4, lab_name: "Major Project Phase I", lab_code: "CSD4102", weeks: 12 },
    // CSM
    { id: 45, program_id: 1, department_id: 4, academic_year_id: 4, lab_name: "Deep Learning Lab", lab_code: "CSM4101", weeks: 12 },
    { id: 46, program_id: 1, department_id: 4, academic_year_id: 4, lab_name: "Natural Language Processing Lab", lab_code: "CSM4102", weeks: 12 },
    // EEE
    { id: 47, program_id: 1, department_id: 5, academic_year_id: 4, lab_name: "Advanced Power Systems Simulation Lab", lab_code: "EEE4101", weeks: 12 },
    { id: 48, program_id: 1, department_id: 5, academic_year_id: 4, lab_name: "Major Project Phase I", lab_code: "EEE4102", weeks: 12 },
];

export const labWeeks = [
    // Sample weeks for C-Programming Lab (lab_id: 1) - Year 1
    { id: 1, lab_id: 1, week_no: 1, title: "Introduction to C & Development Environment", instructions: "Familiarize yourself with the compiler and basic syntax." },
    { id: 2, lab_id: 1, week_no: 2, title: "Data Types & Operators", instructions: "Implement programs using various data types, I/O, and arithmetic operators." },
    { id: 3, lab_id: 1, week_no: 3, title: "Control Structures - Decision Making", instructions: "Use if, if-else, and switch statements." },
    { id: 4, lab_id: 1, week_no: 4, title: "Control Structures - Loops", instructions: "Implement for, while, and do-while loops." },
    { id: 5, lab_id: 1, week_no: 5, title: "Arrays (1D and 2D)", instructions: "Practice operations on single and multi-dimensional arrays, like matrix operations." },
    { id: 6, lab_id: 1, week_no: 6, title: "Strings", instructions: "Perform string manipulations with and without standard library functions." },
    { id: 7, lab_id: 1, week_no: 7, title: "Functions", instructions: "Write modular programs using user-defined functions and recursion." },
    { id: 8, lab_id: 1, week_no: 8, title: "Pointers", instructions: "Understand pointer basics, pass-by-reference, and dynamic memory allocation." },
    { id: 9, lab_id: 1, week_no: 9, title: "Structures and Unions", instructions: "Create composite data types using structures and arrays of structures." },
    { id: 10, lab_id: 1, week_no: 10, title: "File Operations", instructions: "Read from and write to text files." },
    
    // Sample weeks for Data Structures Lab (lab_id: 11) - Year 2 CSE
    { id: 11, lab_id: 11, week_no: 1, title: "Review of C Pointers & Structures", instructions: "Review dynamic memory and basic structure implementations." },
    { id: 12, lab_id: 11, week_no: 2, title: "Singly Linked Lists", instructions: "Implement insertion, deletion, and traversal operations." },
    { id: 13, lab_id: 11, week_no: 3, title: "Doubly Linked Lists", instructions: "Implement operations for a doubly linked list." },
    { id: 14, lab_id: 11, week_no: 4, title: "Stacks", instructions: "Implement Stack using arrays and linked lists." },
    { id: 15, lab_id: 11, week_no: 5, title: "Queues", instructions: "Implement Queue and Circular Queue using arrays." }
];

export const weekQuestions = [
    // Questions for C-Programming Lab, Week 1 (week_id: 1)
    { 
        id: 1, 
        lab_id: 1,
        week_id: 1, 
        question_text: "Write a C program to print 'Hello, World!'.", 
        copy_text: "printf(\"Hello, World!\\n\");", 
        display_order: 1,
        answer: `#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}`
    },
    { 
        id: 2, 
        lab_id: 1,
        week_id: 1, 
        question_text: "Write a program to read an integer number and print it.", 
        copy_text: null, 
        display_order: 2,
        answer: `#include <stdio.h>\n\nint main() {\n    int num;\n    printf("Enter an integer: ");\n    scanf("%d", &num);\n    printf("You entered: %d\\n", num);\n    return 0;\n}`
    },
    { 
        id: 3, 
        lab_id: 1,
        week_id: 1, 
        question_text: "Write a program that takes two integers as input and displays their sum.", 
        copy_text: "a + b", 
        display_order: 3,
        answer: `#include <stdio.h>\n\nint main() {\n    int a, b, sum;\n    printf("Enter two integers: ");\n    scanf("%d %d", &a, &b);\n    sum = a + b;\n    printf("Sum: %d\\n", sum);\n    return 0;\n}`
    },

    // Questions for C-Programming Lab, Week 2 (week_id: 2)
    { 
        id: 4, 
        lab_id: 1,
        week_id: 2, 
        question_text: "Write a C program to compute the perimeter and area of a rectangle.", 
        answer: `#include <stdio.h>\n\nint main() {\n    float length = 10.0;\n    float width = 5.0;\n    printf("Perimeter: %.2f\\n", 2 * (length + width));\n    printf("Area: %.2f\\n", length * width);\n    return 0;\n}`
    },
    { 
        id: 5, 
        lab_id: 1,
        week_id: 2, 
        question_text: "Write a program to demonstrate the use of sizeof() operator for different data types.", 
        answer: `#include <stdio.h>\n\nint main() {\n    printf("Size of int: %zu bytes\\n", sizeof(int));\n    printf("Size of float: %zu bytes\\n", sizeof(float));\n    printf("Size of double: %zu bytes\\n", sizeof(double));\n    printf("Size of char: %zu byte\\n", sizeof(char));\n    return 0;\n}`
    },
    { 
        id: 6, 
        lab_id: 1,
        week_id: 2, 
        question_text: "Write a program to swap two numbers without using a third variable.",   
        answer: `#include <stdio.h>\n\nint main() {\n    int a = 10, b = 20;\n    a = a + b;\n    b = a - b;\n    a = a - b;\n    printf("After swap: a=%d, b=%d\\n", a, b);\n    return 0;\n}`
    },
    
    // Questions for Data Structures Lab, Week 2 (week_id: 12)
    { 
        id: 7, 
        lab_id: 11,
        week_id: 12, 
        question_text: "Write a C program to create a singly linked list of n nodes and print their data.", 
        answer: `#include <stdio.h>\n#include <stdlib.h>\n\nstruct Node {\n    int data;\n    struct Node* next;\n};\n\nvoid printList(struct Node* n) {\n    while (n != NULL) {\n        printf("%d ", n->data);\n        n = n->next;\n    }\n}\n\nint main() {\n    struct Node* head = NULL;\n    struct Node* second = NULL;\n    head = (struct Node*)malloc(sizeof(struct Node));\n    second = (struct Node*)malloc(sizeof(struct Node));\n    head->data = 1;\n    head->next = second;\n    second->data = 2;\n    second->next = NULL;\n    printList(head);\n    return 0;\n}`
    },
    { 
        id: 8, 
        lab_id: 11,
        week_id: 12, 
        question_text: "Write a program to insert a new node at the beginning and end of a singly linked list.", 
        answer: `#include <stdio.h>\n#include <stdlib.h>\n\nstruct Node { int data; struct Node* next; };\n// Implementation omitted for brevity\nint main() { return 0; }` 
    },
    { 
        id: 9, 
        lab_id: 11,
        week_id: 12, 
        question_text: "Write a program to delete a node from the middle of a singly linked list.", 
        answer: `#include <stdio.h>\n#include <stdlib.h>\n\nstruct Node { int data; struct Node* next; };\n// Implementation omitted for brevity\nint main() { return 0; }`
    }
];


