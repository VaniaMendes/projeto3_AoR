package aor.paj.dao;


import aor.paj.entity.TaskEntity;
import aor.paj.entity.UserEntity;
import jakarta.ejb.Stateless;
import jakarta.persistence.NoResultException;

import java.util.ArrayList;

@Stateless
public class ActivityDao extends TaskDao<TaskEntity> {

	private static final long serialVersionUID = 1L;

	public ActivityDao() {
		super(TaskEntity.class);
	}
	

	public TaskEntity findActivityById(int id) {
		try {
			return (TaskEntity) em.createNamedQuery("Activity.findActivityById").setParameter("id", id)
					.getSingleResult();

		} catch (NoResultException e) {
			return null;
		}

	}

	public ArrayList<TaskEntity> findActivityByUser(UserEntity userEntity) {
		try {
			ArrayList<TaskEntity> activityEntityEntities = (ArrayList<TaskEntity>) em.createNamedQuery("Activity.findActivityByUser").setParameter("owner", userEntity).getResultList();
			return activityEntityEntities;
		} catch (Exception e) {
			return null;
		}
	}
}
