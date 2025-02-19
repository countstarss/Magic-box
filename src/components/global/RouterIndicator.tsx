import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { usePathname } from "next/navigation";


interface RouterIndicatorProps {
    firstPath?: string;
    secondPath?: string;
    thirdPath?: string;
    fourthPath?: string;
}

const RouterIndicator: React.FC<RouterIndicatorProps> = ({
    firstPath,
    secondPath,
    thirdPath,
    fourthPath
}) => {

    const path = usePathname()
    const paths = path?.split('/') || []

    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbLink href={`/${paths[1]}`}>
                        <p className='text-sm'>
                            {paths[1]}
                        </p>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                {
                    paths[2] && (
                        <>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink href={`/${paths[1]}/${paths[2]}`}>
                                    <p className='text-sm'>
                                        {paths[2]}
                                    </p>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                        </>
                    )
                }
                {paths[3] && paths[3].length<16 && (
                    <>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href={`/${paths[1]}/${paths[2]}/${paths[3]}`}>
                                <p className='text-sm'>
                                    {paths[3]}
                                </p>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                    </>
                )}
                {paths[4] && paths[4].length<16 && (
                    <>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href={`/${paths[1]}/${paths[2]}/${paths[3]}/${paths[4]}`}>
                                <p className='text-sm'>{paths[4]}</p>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                    </>
                )}

                {
                    firstPath && (
                        <>
                            <BreadcrumbItem>
                                <BreadcrumbLink href={`/${firstPath}`}>
                                    <p className='text-sm'>{firstPath}</p>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                        </>
                    )
                }

                {
                    secondPath && (
                        <>

                            <BreadcrumbItem>
                                <BreadcrumbLink href={`/${firstPath}/${secondPath}`}>
                                    <p className='text-sm'>{secondPath}</p>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                        </>
                    )
                }

                {
                    thirdPath && (
                        <>
                            <BreadcrumbItem>
                                <BreadcrumbLink href={`/${firstPath}/${secondPath}/${thirdPath}`}>
                                    <p className='text-sm'>{thirdPath}</p>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                        </>
                    )
                }
                {
                    fourthPath && (
                        <>
                            <BreadcrumbItem>
                                <BreadcrumbLink href={`/${firstPath}/${secondPath}/${thirdPath}/${fourthPath}`}>
                                    <p className='text-sm'>{fourthPath}</p>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                        </>
                    )
                }
            </BreadcrumbList>
        </Breadcrumb>
    )
}

export default RouterIndicator;