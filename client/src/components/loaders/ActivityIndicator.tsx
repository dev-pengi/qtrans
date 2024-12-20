import { FC } from "react";
import "../styles/loaders.css";

interface ActivityIndicatorProps {
  size?: number;
}

const ActivityIndicator: FC<ActivityIndicatorProps> = ({ size = 12 }) => {
  return (
    <div
      className="activity-indicator"
      style={{
        fontSize: size,
      }}
    >
      <div className="spinner">
        <div className="circle circle-1">
          <div className="circle-inner rounded-full" />
        </div>
        <div className="circle circle-2">
          <div className="circle-inner rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default ActivityIndicator;
