create table questions (
	id bigint not null auto_increment,
	primary key (id),

	created_at datetime not null, /* Time when the question was created. */
	question_text varchar(140) not null,

	parent_index bigint,
	yes_child_index bigint,
	no_child_index bigint
);