import Skeleton from "react-loading-skeleton"
import '../../style/Skeleton.css';

const DocumentSkeleton = ({ documents }) => {

    return Array(documents)
    .fill(0)
    .map((_, i) => (
        <div className="card-skeleton" key={i}>
            <div className="left-col">
                <Skeleton width={200}  height={250}  />
            </div>
            <div className="right-col">
                <Skeleton count={3}  />
            </div>
        </div>
    ));
    
}

export default DocumentSkeleton;