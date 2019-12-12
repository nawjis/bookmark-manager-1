import { Component, OnInit, Inject, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState, selectBookmarks, selectBookmarksGroups, selectBookmarksByGroup } from '../app.state';
import { Bookmarks, Bookmark, DeleteBookmark, CreateBookmark, LoadBookmarkInit, EditBookmark, RestoreBookmarks } from './state';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-bookmark',
  templateUrl: './bookmark.component.html',
  styleUrls: ['./bookmark.component.scss']
})
export class BookmarkComponent implements OnInit {

  bookmarks$: Observable<Bookmark[]>;
  groups$: Observable<string[]>;

  displayedColumns: string[] = ['Name', 'URL', 'Group', 'Delete'];

  isEditMode = false;

  selectedGroup: string;

  constructor(private store: Store<AppState>, public dialog: MatDialog) { }

  ngOnInit() {
    this.groups$ = this.store.pipe(select(selectBookmarksGroups));
    this.selectGroup('All');
    this.loadBookmarks();
  }

  selectGroup(group: string) {
    this.selectedGroup = group;
    if (group === 'All') {
      this.bookmarks$ = this.store.pipe(select(selectBookmarks));
    } else {
      this.bookmarks$ = this.store.pipe(select(selectBookmarksByGroup(group)));
    }
  }

  createBookmark(bookmark: Bookmark) {
    this.store.dispatch(new CreateBookmark(bookmark));
  }

  editBookmark(bookmark: Bookmark) {
    this.store.dispatch(new EditBookmark(bookmark));
  }


  deleteBookmark(bookmark: Bookmark) {
    this.store.dispatch(new DeleteBookmark(bookmark));
  }

  loadBookmarks() {
    this.store.dispatch(new LoadBookmarkInit(null));
  }

  openDialog(editMode: boolean = false, bookmark: BookmarkData ): void {
    const dialogData = new DialogData(editMode, bookmark);

    const dialogRef = this.dialog.open(DialogCreateBookmarkComponent, {
      width: '400px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        if (editMode) {
          this.editBookmark(data);
        } else {
          this.createBookmark(data.bookMarkData);
        }
      }
    });
  }
}

@Component({
  selector: 'app-bookmark-create-dialog',
  templateUrl: './bookmark.create-dialog.html',
})
export class DialogCreateBookmarkComponent {

  isEditMode = false;

  constructor(
    public dialogRef: MatDialogRef<DialogCreateBookmarkComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
      this.isEditMode = data.isEditMode;
    }

  onCancel(): void {
    this.dialogRef.close();
  }

}

export class DialogData {
  bookMarkData: BookmarkData;
  isEditMode = false;

  constructor(isEditMode: boolean, bookmarkData: BookmarkData) {
    this.isEditMode = isEditMode;
    if (!isEditMode) {
      this.bookMarkData = new BookmarkData();
    } else {
      this.bookMarkData = bookmarkData;
    }
  }
}

export class BookmarkData implements Bookmark {
  name: '';
  url: '';
  group: '';
}

