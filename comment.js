export class Comment {
  constructor(value, name, handle, id, parent, upvotes, downvotes) {
    this.value = value;
    this.name = name;
    this.handle = handle;
    this.id = id;
    this.updatedAt = new Date();
    this.parent = parent;
    this.upvotes = upvotes;
    this.downvotes = downvotes;
    this.children = [];
  }
}
