create table tbl_file
(
    id               bigint generated always as identity primary key,
    file_origin_name varchar(255) not null,
    file_path        varchar(255) not null,
    file_name        varchar(255) not null,
    file_size        varchar(255) not null,
    created_datetime timestamp default now(),
    updated_datetime timestamp default now()
);


alter table tbl_file
    add column file_size varchar(255);

alter table tbl_file alter column file_size set not null;

select * from tbl_file;


delete from tbl_file
where id = 19;

SELECT * FROM tbl_file WHERE id = 8;
SELECT * FROM tbl_member_file WHERE member_id = 8;