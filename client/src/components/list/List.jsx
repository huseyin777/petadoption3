import "./list.scss";
import Card from "../card/Card";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function List({ posts, onDelete }) {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="list">
      {posts.map((item) => (
        <div key={item.id} className="postItem">
          <Card key={item.id} item={item} />
          {/* Post content */}
          {onDelete && currentUser?.id === item.userId && (
            <button className="deleteButton" onClick={() => onDelete(item.id)}>
              Delete
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
export default List;
