import { BookmarkActions, EBookmarkActions } from './bookmark.actions';
import { Bookmarks, initialBookmarksState, Bookmark } from './bookmark.state';

export function bookmarkReducer(state = initialBookmarksState, action: BookmarkActions): Bookmarks {
    switch (action.type) {
        case EBookmarkActions.GET_BOOKMARKS: {
            console.log('REDUCER: ' + EBookmarkActions.GET_BOOKMARKS);
            return  {...state};
        }
        case EBookmarkActions.CREATE_BOOKMARK: {
            console.log('REDUCER: ' + EBookmarkActions.CREATE_BOOKMARK);
            return  { bookmarks: state.bookmarks.concat(action.payload)};
        }
        
        case EBookmarkActions.LOAD_BOOKMARK_DONE: {
            console.log('REDUCER: ' + EBookmarkActions.LOAD_BOOKMARK_DONE);
            return  { bookmarks: state.bookmarks.concat(action.payload.bookmarks)};
        }
        default: {
            console.log('REDUCER: Default');
            return {
                ...state
            };
        }
    }
}
