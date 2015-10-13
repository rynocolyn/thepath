truncate table questions;
/* id 1  -- First question */
insert into questions(created_at, question_text) values
	(now(), "Is the sky blue?");
/* id 2 & 3 -- First level of following questions */
insert into questions(created_at, question_text, parent_index) values
	(now(), "Do you like apples more than oranges?", 1);
update questions set yes_child_index=2 where id=1;

insert into questions(created_at, question_text, parent_index) values
	(now(), "Are you colour blind?", 1);
update questions set no_child_index=3 where id=1;
