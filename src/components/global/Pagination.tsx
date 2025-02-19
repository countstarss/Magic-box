import React from 'react';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"


interface PaginationProps {
    handleNext: () => void;
    handlePrev: () => void;
    setIndex: (index: number) => void;
}

const PaginationDemo = ({ handleNext, handlePrev, setIndex }: PaginationProps) => {


    return (
        <div className='border border-gray-600  dark:border-gray-400 rounded-md'>
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious className='cursor-pointer' onClick={handlePrev} />
                    </PaginationItem>
                    {
                        Array.from({ length: 3 }).map((_, index) => (
                            <PaginationItem
                                key={index}
                            >
                                <PaginationLink className='cursor-pointer' onClick={() => setIndex(index)}>{index + 1}</PaginationLink>
                            </PaginationItem>
                        ))
                    }
                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationNext className='cursor-pointer' onClick={handleNext} />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
};

export default PaginationDemo;
